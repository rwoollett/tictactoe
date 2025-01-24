import { FieldResolver } from "nexus";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { GameUpdateByIdEvent } from "../../events/gameUpdateByIdEvent";
import { Subjects } from "../../events";

/**
 * Create New Game 
 * 
 * The user post a mutation of createGame
 * The id create in game table is used to identify the game to the back end node cstoken workers.
 * The cstoken workers publish the game update to the game id.
 * The return Game data has the id which is needed to subscribe to with board updates.
 * 
 * @returns Game 
 */

export const createGameResolver: FieldResolver<
  "Mutation", "createGame"
> = async (_, { player, opponentStart }, { prisma }) => {

  const newGame = await prisma.game.create({
    data: {
      player,
      opponentStart
    }
  });

  return {
    id: newGame.id,
    player,
    opponentStart,
    allocated: newGame.allocated, // this field in not required for allocation anymore as get this data from moves in the game
    board: newGame.board,
    createdAt: newGame.createdAt ? newGame.createdAt.toISOString() : "",
    playerMoves: []
  }
};


/**
 * Get New Game 
 * 
 * Find the new game posted by a user.
 * When retrieved the allocated field is updated to true. The new game post does not need to be found 
 * again. It will be processed by the back end nodeId, and then posted back with ServerCreateBoard to
 * enable the publish of this game id to the end user.
 *  
 * @returns task 
 */
// export const getNewBoardResolver: FieldResolver<
//   "Query",
//   "getNewBoard"
// > = async (_, { }, { prisma }) => {

//   try {
//     const game = await prisma.game.findFirst({
//       select: {
//         id: true,
//         allocated: true,
//       },
//       where:
//       {
//         allocated: false
//       },
//     });

//     if (game) {
//       const updateGame = await prisma.game.update({
//         select: {
//           id: true,
//           player: true,
//           opponentStart: true,
//           allocated: true,
//           createdAt: true,
//           board: true,
//           playerMoves: {
//             select: {
//               id: true,
//               gameId: true,
//               moveCell: true,
//               allocated: true
//             }
//           }
//         },
//         data: {
//           allocated: true
//         },
//         where: {
//           id: game.id
//         }
//       });
//       return [{
//         ...updateGame,
//         createdAt: updateGame.createdAt ? updateGame.createdAt.toISOString() : "",
//       }];
//     } else {
//       return [];
//     }

//   } catch (error) {
//     if (
//       error instanceof PrismaClientKnownRequestError &&
//       error.code == 'P2025'
//     ) {
//       console.log(
//         '\u001b[1;31m' +
//         'PrismaClientKnownRequestError is catched' +
//         '(Error name: ' +
//         error.name +
//         ')' +
//         '\u001b[0m'
//       );
//     }
//     return [];
//   };
// };

/**
 * Create/Update Board for Game by GameId 
 * 
 * The server post a mutation of updateBoardGame
 * The id create in game table is used to identify the game to the back end node cstoken workers.
 * This publishes the game update as a subscription to end user - who has the game id.
 * 
 * @returns Game 
 */

export const serverUpdateBoardResolver: FieldResolver<
  "Mutation", "serverUpdateBoard"
> = async (_, { gameId, board }, { prisma, pubsub }) => {

  try {
    const game = await prisma.game.findFirst({
      select: {
        id: true,
      //  allocated: true,
      },
      where:
      {
      //  allocated: true,
        id: gameId
      },
    });

    if (game) {
      const updateGame = await prisma.game.update({
        select: {
          id: true,
          player: true,
          opponentStart: true,
          allocated: true,
          createdAt: true,
          board: true,
          playerMoves: {
            select: {
              id: true,
              gameId: true,
              moveCell: true,
              allocated: true
            }
          }
        },
        data: {
      //    allocated: true,
          board: board
        },
        where: {
          id: game.id
        }
      });

      pubsub && pubsub.publish(Subjects.GameUpdateById,
        {
          subject: Subjects.GameUpdateById,
          data: { gameId, board }
        } as GameUpdateByIdEvent);

      return {
        ...updateGame,
        createdAt: updateGame.createdAt ? updateGame.createdAt.toISOString() : "",
      };
    } else {
      throw new Error(`Game Id not found: ${gameId}. Could not publish a new board.`);
    }

  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code == 'P2025'
    ) {
      console.log(
        '\u001b[1;31m' +
        'PrismaClientKnownRequestError is catched' +
        '(Error name: ' +
        error.name +
        ')' +
        '\u001b[0m'
      );
    }
    throw new Error(`Game Id not found: ${gameId}. Could not publish a new board.`);
  };
};

/**
 * Subscribe to board updates by game id
 * 
 * @returns Board 
 */
export const subcribeBoardByGameIdResolver = (payload: GameUpdateByIdEvent) => {
  const { data: { gameId, board } } = payload;
  return { gameId, board };
};

/**
 * Make Player Move 
 * 
 * The user post a mutation of boardMove
 * The id create in game table is used to identify the game to the back end node cstoken workers.
 * The publish the game update to the game id.
 * The return Game data has the id which is needed to subscribe to with board updates.
 * 
 * @returns Game 
 */

export const boardMoveResolver: FieldResolver<
  "Mutation", "boardMove"
> = async (_, { gameId, moveCell }, { prisma }) => {

  const newMove = await prisma.playerMove.create({
    data: {
      gameId,
      moveCell
    }
  });

  return {
    id: newMove.id,
    allocated: newMove.allocated,
    moveCell: newMove.moveCell,
    gameId: newMove.gameId
  }
};

/**
 * Get Players Board Move 
 * 
 * Find the board moves posted by a user.
 * When retrieved the allocated field is updated to true. 
 * It will be processed by the back end nodeId, and then posted back with ServerUpdateBoard
 * to enable the publish of this game id to the end user.
 *  
 * @returns PlayerMove 
 */
export const getPlayerMoveResolver: FieldResolver<
  "Query",
  "getPlayerMove"
> = async (_, { }, { prisma }) => {

  try {
    const move = await prisma.playerMove.findFirst({
      select: {
        id: true,
        allocated: true,
        gameId: true,
        moveCell: true
      },
      where:
      {
        allocated: false
      },
    });

    if (move) {
      const updateMove = await prisma.playerMove.update({
        select: {
          id: true,
          allocated: true,
          gameId: true,
          moveCell: true
        },
        data: {
          allocated: true
        },
        where: {
          id: move.id
        }
      });
      return [{
        ...updateMove
      }];
    } else {
      return [];
    }

  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code == 'P2025'
    ) {
      console.log(
        '\u001b[1;31m' +
        'PrismaClientKnownRequestError is catched' +
        '(Error name: ' +
        error.name +
        ')' +
        '\u001b[0m'
      );
    }
    return [];
  };
};

// export const getTaskResultByGenIDResolver: FieldResolver<
//   "Query",
//   "getTaskResultByGenID"
// > = async (_, { genId }, { prisma }) => {

//   try {
//     const taskResult = await prisma.taskResult.findMany({
//       select: {
//         id: true,
//         genId: true,
//         row: true,
//         length: true,
//         rows: {
//           select: {
//             id: true,
//             order: true,
//             taskResultId: true,
//             cols: true
//           },
//           orderBy: {
//             order: 'asc'
//           }
//         }
//       },
//       where:
//       {
//         genId: genId
//       },
//       orderBy: [
//         {
//           row: 'asc'
//         }
//       ]
//     });

//     return taskResult;

//   } catch (error) {
//     if (
//       error instanceof PrismaClientKnownRequestError &&
//       error.code == 'P2025'
//     ) {
//       console.log(
//         '\u001b[1;31m' +
//         'PrismaClientKnownRequestError is catched' +
//         '(Error name: ' +
//         error.name +
//         ')' +
//         '\u001b[0m'
//       );
//     }
//     return null;
//   };
// };


export const removeGameCompleteResolver: FieldResolver<
  "Mutation", "removeGameComplete"
> = async (_, { gameId }, { prisma }) => {

  const removeMany = await prisma.game.deleteMany({
    where: {
      id: gameId,
      allocated: true
    }
  });

  const removeManyResult = await prisma.playerMove.deleteMany({
    where: {
      gameId: gameId
    }
  });

  return { message: `Removed ${removeMany.count + removeManyResult.count} records successfully` };
};


// export const postBoardByGenIDResolver: FieldResolver<
//   "Mutation", "postBoardByGenID"
// > = async (_, { genId, rows, cols, board }, { pubsub }) => {

//   const boardOutput = board.data.map((cols, index) => {
//     return cols;
//   });

//   pubsub && pubsub.publish(Subjects.GameUpdateById,
//     {
//       subject: Subjects.GameUpdateById,
//       data: { genId, rows, cols, board: boardOutput }
//     } as GameUpdateByIdEvent);

//   return { genId, rows, cols, board: boardOutput }
// };

// export const subcribeBoardGenerateResolver = (payload: GameUpdateByIdEvent) => {
//   const { data: { genId, rows, cols, board } } = payload;
//   return { genId, rows, cols, board };
// };

