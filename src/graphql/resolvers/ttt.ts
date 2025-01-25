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
> = async (_, { userId }, { prisma }) => {

  const newGame = await prisma.game.create({
    data: {
      userId
    }
  });

  return {
    id: newGame.id,
    userId,
    board: newGame.board,
    createdAt: newGame.createdAt ? newGame.createdAt.toISOString() : "",
    //playerMoves: []
  }
};


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
      },
      where:
      {
        id: gameId
      },
    });

    if (game) {
      const updateGame = await prisma.game.update({
        select: {
          id: true,
          userId: true,
          createdAt: true,
          board: true,
          playerMoves: {
            select: {
              id: true,
              allocated: true,
              gameId: true,
              player: true,
              moveCell: true,
            }
          }
        },
        data: {
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
> = async (_, { gameId, player, moveCell }, { prisma }) => {

  try {
    const newMove = await prisma.playerMove.create({
      data: {
        gameId,
        player,
        moveCell
      },
      select: {
        id: true,
        allocated: true,
        game: true
      }
    });

    if (moveCell > 8) {
      throw new Error(`Player move creation has error in game id: ${gameId}. Could not create record of the players move at ${moveCell}.`);
    }

    const boardArray = newMove.game.board.split(",");
    const newBoard = boardArray.slice(0, moveCell)
      .concat([player.toString()])
      .concat(boardArray.slice(moveCell + 1))
      .join(",");

    const game = await prisma.game.findFirst({
      select: {
        id: true,
      },
      where:
      {
        id: gameId
      },
    });
    const updateGame = await prisma.game.update({
      select: {
        board: true,
      },
      data: {
        board: newBoard
      },
      where: {
        id: gameId
      }
    });

    return {
      id: newMove.id,
      allocated: newMove.allocated,
      gameId, player, moveCell,
      game: {
        id: newMove.game.id,
        board: newBoard,
        userId: newMove.game.userId,
        createdAt: newMove.game.createdAt ? newMove.game.createdAt.toISOString() : ""
      }
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
    throw new Error("Mutation boardMove: " + (error as Error).message);
  };

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
        allocated: true
        // gameId: true,
        // player: true,
        // moveCell: true,
        // game: true
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
          player: true,
          moveCell: true,
          game: {
            select: {
              board: true,
              userId: true,
              id: true,
              createdAt: true
            }
          }
        },
        data: {
          allocated: true
        },
        where: {
          id: move.id
        }
      });
      return [{
        ...updateMove,
        game: {
          ...updateMove.game,
          createdAt: updateMove.game.createdAt ? updateMove.game.createdAt.toISOString() : ""
        }
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

export const removeGameCompleteResolver: FieldResolver<
  "Mutation", "removeGameComplete"
> = async (_, { gameId }, { prisma }) => {

  const removeMany = await prisma.game.deleteMany({
    where: {
      id: gameId
    }
  });

  const removeManyResult = await prisma.playerMove.deleteMany({
    where: {
      gameId: gameId
    }
  });

  return { message: `Removed ${removeMany.count + removeManyResult.count} records successfully` };
};
