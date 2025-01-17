import {
  inputObjectType,
  intArg,
  booleanArg,
  list,
  nonNull,
  objectType,
  stringArg,
} from 'nexus';
import { extendType } from 'nexus'
import { Subjects } from '../../events';

/**
 * Game
 */
export const Game = objectType({
  name: 'Game',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.int('player')
    t.nonNull.string('board')
    t.nonNull.boolean('allocated', {
      description: "When found with query getCreateGame as findFirst this is marked true."
    }),
    t.nonNull.list.field('playerMoves', {
      type: 'PlayerMove',
      description: "The players moves made against oppenent"
    })

  },
  description: "Tic Tac Toes game board. The player can play as Nought(1) or Cross(2). O is empty cell."
});

/**
 * Player Move
 */
export const PlayerMove = objectType({
  name: 'PlayerMove',
  definition(t) {
    t.nonNull.int('id')
    t.nonNull.int('gameId')
    t.nonNull.int('moveCell')
    t.nonNull.boolean('allocated', {
      description: "When found with query getPlayerMove as findFirst this is marked true."
    })
  },
  description: "The players moves in the Tic Tac Toe board against oppenent."
})


// export const TTTQuery = extendType({
//   type: 'Query',
//   definition(t) {
//     t.field('getNewBoard', {
//       type: list('Board'),
//       args: {
//         nodeId: nonNull(stringArg()),
//       },
//       //resolve: getNewBoardResolver
//     });
//     t.field('getPlayerMove', {
//       type: list('PlayerMove'),
//       args: {
//         genId: nonNull(intArg())
//       },
//       //resolve: getPlayerMoveResolver
//     });
//   },
// });


export const RemovalResult = objectType({
  name: 'RemovalResult',
  definition(t) {
    t.nonNull.string('message')
  },
  description: "Removal result."
})

export const TTTMutations = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('createGame', {
      type: 'Game',
      args: {
        player: nonNull(intArg()),
        opponentStart: nonNull(booleanArg()),
      },
      resolve: createGameResolver
    });
    t.nonNull.field('removeGameComplete', {
      type: 'RemovalResult',
      args: {
        genId: nonNull(intArg())
      },
     //resolve: removeGameCompleteResolver
    });

  },
})

// export const Subscription = extendType({
//   type: "Subscription",
//   definition(t) {
//     t.field(Subjects.GameUpdateById, {
//       type: 'BoardOutput',
//       subscribe(_root, _args, ctx) {
//         return ctx.pubsub.asyncIterator(Subjects.GameUpdateById)
//       },
//       resolve: subcribeBoardGenerateResolver
//     });

//   },
// });


