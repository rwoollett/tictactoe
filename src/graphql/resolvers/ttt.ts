import { FieldResolver } from "nexus";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { GameUpdateByIdEvent } from "../../events/gameUpdateByIdEvent";
import { Subjects } from "../../events";

/**
 * Task Manager role granted
 */
let TMRole = false;
const TASK_NEXT_TAKE = 4;

/**
 * Get Task by generation id (genId)
 * 
 * Find the first task from a set of task with the genID and incremented row number.
 * When retrieved the ack field is updated to true. This task does not need to be found 
 * again. It will be processed by end user and posted back into TaskResult.
 *  
 * @param genId 
 * @param prisma 
 * @returns task 
 */
// export const getNextTaskResolver: FieldResolver<
//   "Query",
//   "getNextTask"
// > = async (_, { }, { prisma }) => {

//   try {
//     const task = await prisma.task.findFirst({
//       select: {
//         id: true,
//         genId: true,
//         row: true,
//         length: true,
//         allocated: true,
//         rows: {
//           select: {
//             id: true,
//             order: true,
//             taskId: true,
//             cols: true
//           },
//           orderBy: {
//             order: 'asc'
//           }
//         }
//       },
//       where:
//       {
//         allocated: false
//       },
//       orderBy: [
//         {
//           row: 'asc'
//         }
//       ],
//       //take: TASK_NEXT_TAKE
//     });

//     if (task) {
//       //const taskIds = nextTasks.map(task => task.id);
//       const updateTask = await prisma.task.update({
//         select: {
//           id: true,
//           genId: true,
//           row: true,
//           length: true,
//           allocated: true,
//           rows: {
//             select: {
//               id: true,
//               order: true,
//               taskId: true,
//               cols: true
//             }
//           }
//         },
//         data: {
//           allocated: true
//         },
//         where: {
//           id: task.id
//         }
//       });
//       return [updateTask];
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


// export const postTaskResolver: FieldResolver<
//   "Mutation", "postTask"
// > = async (_, { genId, row, length, rows }, { prisma, pubsub }) => {

//   if (!TMRole) {
//     throw new Error("Task Manager role not granted");
//   }

//   const newTask = await prisma.task.create({
//     data: {
//       genId,
//       row,
//       length,
//     }
//   });

//   const boardRows = rows.data.map(async (cols, index) => {

//     const boardRow = await prisma.boardRow.create({
//       data: {
//         order: index,
//         taskId: newTask.id,
//         cols: [...cols]
//       }
//     });
//     return boardRow;
//   });

//   return {
//     id: newTask.id,
//     genId,
//     row,
//     length,
//     allocated: newTask.allocated,
//     rows: boardRows
//   }
// };


// export const removeTaskCompleteResolver: FieldResolver<
//   "Mutation", "removeTaskComplete"
// > = async (_, { genId }, { prisma }) => {

//   const removeMany = await prisma.task.deleteMany({
//     where: {
//       genId: genId,
//       allocated: true
//     }
//   });

//   const removeManyResult = await prisma.taskResult.deleteMany({
//     where: {
//       genId: genId
//     }
//   });

//   return { message: `Removed ${removeMany.count + removeManyResult.count} records successfully` };
// };


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

