// This file was automatically generated and should not be edited.
#pragma once

#include <memory>
#include <vector>
#include "nlohmann/json.hpp"
#include <optional>
#include <variant>

// optional serialization
namespace nlohmann {
    template <typename T>
    struct adl_serializer<std::optional<T>> {
        static void to_json(json & json, std::optional<T> const & opt) {
            if (opt.has_value()) {
                json = *opt;
            } else {
                json = nullptr;
            }
        }

        static void from_json(const json & json, std::optional<T> & opt) {
            if (json.is_null()) {
                opt.reset();
            } else {
                opt = json.get<T>();
            }
        }
    };
}

namespace caffql {

    using Json = nlohmann::json;
    using Id = std::string;
    using std::optional;
    using std::variant;
    using std::monostate;
    using std::visit;

    enum class Operation { Query, Mutation, Subscription };

    struct GraphqlError {
        std::string message;
    };

    template <typename Data>
    using GraphqlResponse = variant<Data, std::vector<GraphqlError>>;

    inline void from_json(Json const & json, GraphqlError & value) {
        json.at("message").get_to(value.message);
    }

    // The players moves in the Tic Tac Toe board against oppenent.
    struct PlayerMove {
        int32_t id;
        int32_t gameId;
        int32_t moveCell;
        // When found with query getPlayerMove as findFirst this is marked true.
        bool allocated;
    };

    inline void from_json(Json const & json, PlayerMove & value) {
        json.at("id").get_to(value.id);
        json.at("gameId").get_to(value.gameId);
        json.at("moveCell").get_to(value.moveCell);
        json.at("allocated").get_to(value.allocated);
    }

    // Removal result.
    struct RemovalResult {
        std::string message;
    };

    inline void from_json(Json const & json, RemovalResult & value) {
        json.at("message").get_to(value.message);
    }

    // Tic Tac Toes game board. The player can play as Nought(1) or Cross(2). O is empty cell.
    struct Game {
        int32_t id;
        int32_t player;
        std::string board;
        std::string createdAt;
        // When found with query getCreateGame as findFirst this is marked true.
        bool allocated;
        // The players moves made against oppenent
        std::vector<optional<PlayerMove>> playerMoves;
    };

    inline void from_json(Json const & json, Game & value) {
        json.at("id").get_to(value.id);
        json.at("player").get_to(value.player);
        json.at("board").get_to(value.board);
        json.at("createdAt").get_to(value.createdAt);
        json.at("allocated").get_to(value.allocated);
        json.at("playerMoves").get_to(value.playerMoves);
    }

    namespace Mutation {

        struct CreateGameField {

            static Operation constexpr operation = Operation::Mutation;

            static Json request(int32_t player, bool opponentStart) {
                Json query = R"(
                    mutation CreateGame(
                        $player: Int!
                        $opponentStart: Boolean!
                    ) {
                        createGame(
                            player: $player
                            opponentStart: $opponentStart
                        ) {
                            id
                            player
                            board
                            createdAt
                            allocated
                            playerMoves {
                                id
                                gameId
                                moveCell
                                allocated
                            }
                        }
                    }
                )";
                Json variables;
                variables["player"] = player;
                variables["opponentStart"] = opponentStart;
                return {{"query", std::move(query)}, {"variables", std::move(variables)}};
            }

            using ResponseData = Game;

            static GraphqlResponse<ResponseData> response(Json const & json) {
                auto errors = json.find("errors");
                if (errors != json.end()) {
                    std::vector<GraphqlError> errorsList = *errors;
                    return errorsList;
                } else {
                    auto const & data = json.at("data");
                    return ResponseData(data.at("createGame"));
                }
            }

        };

        struct RemoveGameCompleteField {

            static Operation constexpr operation = Operation::Mutation;

            static Json request(int32_t gameId) {
                Json query = R"(
                    mutation RemoveGameComplete(
                        $gameId: Int!
                    ) {
                        removeGameComplete(
                            gameId: $gameId
                        ) {
                            message
                        }
                    }
                )";
                Json variables;
                variables["gameId"] = gameId;
                return {{"query", std::move(query)}, {"variables", std::move(variables)}};
            }

            using ResponseData = RemovalResult;

            static GraphqlResponse<ResponseData> response(Json const & json) {
                auto errors = json.find("errors");
                if (errors != json.end()) {
                    std::vector<GraphqlError> errorsList = *errors;
                    return errorsList;
                } else {
                    auto const & data = json.at("data");
                    return ResponseData(data.at("removeGameComplete"));
                }
            }

        };

    } // namespace Mutation

    namespace Query {

        struct GetNewBoardField {

            static Operation constexpr operation = Operation::Query;

            static Json request(std::string const & nodeId) {
                Json query = R"(
                    query GetNewBoard(
                        $nodeId: String!
                    ) {
                        getNewBoard(
                            nodeId: $nodeId
                        ) {
                            id
                            player
                            board
                            createdAt
                            allocated
                            playerMoves {
                                id
                                gameId
                                moveCell
                                allocated
                            }
                        }
                    }
                )";
                Json variables;
                variables["nodeId"] = nodeId;
                return {{"query", std::move(query)}, {"variables", std::move(variables)}};
            }

            using ResponseData = optional<std::vector<optional<Game>>>;

            static GraphqlResponse<ResponseData> response(Json const & json) {
                auto errors = json.find("errors");
                if (errors != json.end()) {
                    std::vector<GraphqlError> errorsList = *errors;
                    return errorsList;
                } else {
                    auto const & data = json.at("data");
                    auto it = data.find("getNewBoard");
                    if (it != data.end()) {
                        return ResponseData(*it);
                    } else {
                        return ResponseData{};
                    }
                }
            }

        };

        struct GetPlayerMoveField {

            static Operation constexpr operation = Operation::Query;

            static Json request(int32_t genId) {
                Json query = R"(
                    query GetPlayerMove(
                        $genId: Int!
                    ) {
                        getPlayerMove(
                            genId: $genId
                        ) {
                            id
                            gameId
                            moveCell
                            allocated
                        }
                    }
                )";
                Json variables;
                variables["genId"] = genId;
                return {{"query", std::move(query)}, {"variables", std::move(variables)}};
            }

            using ResponseData = optional<std::vector<optional<PlayerMove>>>;

            static GraphqlResponse<ResponseData> response(Json const & json) {
                auto errors = json.find("errors");
                if (errors != json.end()) {
                    std::vector<GraphqlError> errorsList = *errors;
                    return errorsList;
                } else {
                    auto const & data = json.at("data");
                    auto it = data.find("getPlayerMove");
                    if (it != data.end()) {
                        return ResponseData(*it);
                    } else {
                        return ResponseData{};
                    }
                }
            }

        };

    } // namespace Query

} // namespace caffql
