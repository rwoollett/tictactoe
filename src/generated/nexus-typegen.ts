/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { Context } from "./../api/context"




declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
}

export interface NexusGenObjects {
  Game: { // root type
    allocated: boolean; // Boolean!
    board: string; // String!
    createdAt: string; // String!
    id: number; // Int!
    opponentStart: boolean; // Boolean!
    player: number; // Int!
    playerMoves: Array<NexusGenRootTypes['PlayerMove'] | null>; // [PlayerMove]!
  }
  Mutation: {};
  PlayerMove: { // root type
    allocated: boolean; // Boolean!
    gameId: number; // Int!
    id: number; // Int!
    moveCell: number; // Int!
  }
  Query: {};
  RemovalResult: { // root type
    message: string; // String!
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars

export interface NexusGenFieldTypes {
  Game: { // field return type
    allocated: boolean; // Boolean!
    board: string; // String!
    createdAt: string; // String!
    id: number; // Int!
    opponentStart: boolean; // Boolean!
    player: number; // Int!
    playerMoves: Array<NexusGenRootTypes['PlayerMove'] | null>; // [PlayerMove]!
  }
  Mutation: { // field return type
    createGame: NexusGenRootTypes['Game']; // Game!
    removeGameComplete: NexusGenRootTypes['RemovalResult']; // RemovalResult!
  }
  PlayerMove: { // field return type
    allocated: boolean; // Boolean!
    gameId: number; // Int!
    id: number; // Int!
    moveCell: number; // Int!
  }
  Query: { // field return type
    getNewBoard: Array<NexusGenRootTypes['Game'] | null> | null; // [Game]
    getPlayerMove: Array<NexusGenRootTypes['PlayerMove'] | null> | null; // [PlayerMove]
  }
  RemovalResult: { // field return type
    message: string; // String!
  }
}

export interface NexusGenFieldTypeNames {
  Game: { // field return type name
    allocated: 'Boolean'
    board: 'String'
    createdAt: 'String'
    id: 'Int'
    opponentStart: 'Boolean'
    player: 'Int'
    playerMoves: 'PlayerMove'
  }
  Mutation: { // field return type name
    createGame: 'Game'
    removeGameComplete: 'RemovalResult'
  }
  PlayerMove: { // field return type name
    allocated: 'Boolean'
    gameId: 'Int'
    id: 'Int'
    moveCell: 'Int'
  }
  Query: { // field return type name
    getNewBoard: 'Game'
    getPlayerMove: 'PlayerMove'
  }
  RemovalResult: { // field return type name
    message: 'String'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    createGame: { // args
      opponentStart: boolean; // Boolean!
      player: number; // Int!
    }
    removeGameComplete: { // args
      gameId: number; // Int!
    }
  }
  Query: {
    getNewBoard: { // args
      nodeId: string; // String!
    }
    getPlayerMove: { // args
      genId: number; // Int!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = never;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}