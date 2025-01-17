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

namespace golql {

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

    // A subset of rows, or the complete rows from the GOL board for one generate.
    struct BoardOutput {
        int32_t genId;
        int32_t rows;
        int32_t cols;
        std::vector<std::vector<int32_t>> board;
    };

    inline void from_json(Json const & json, BoardOutput & value) {
        json.at("genId").get_to(value.genId);
        json.at("rows").get_to(value.rows);
        json.at("cols").get_to(value.cols);
        json.at("board").get_to(value.board);
    }

    // The columns in the GOL board row.
    struct BoardRow {
        int32_t id;
        int32_t order;
        int32_t taskId;
        std::vector<int32_t> cols;
    };

    inline void from_json(Json const & json, BoardRow & value) {
        json.at("id").get_to(value.id);
        json.at("order").get_to(value.order);
        json.at("taskId").get_to(value.taskId);
        json.at("cols").get_to(value.cols);
    }

    // The columns in the GOL board row.
    struct BoardRowResult {
        int32_t id;
        int32_t order;
        int32_t taskResultId;
        std::vector<int32_t> cols;
    };

    inline void from_json(Json const & json, BoardRowResult & value) {
        json.at("id").get_to(value.id);
        json.at("order").get_to(value.order);
        json.at("taskResultId").get_to(value.taskResultId);
        json.at("cols").get_to(value.cols);
    }

    // A subset of rows, or the complete rows from the GOL board for one generate.
    struct BoardRowsInput {
        std::vector<std::vector<int32_t>> data;
    };

    inline void to_json(Json & json, BoardRowsInput const & value) {
        json["data"] = value.data;
    }

    // Removal result.
    struct RemovalResult {
        std::string message;
    };

    inline void from_json(Json const & json, RemovalResult & value) {
        json.at("message").get_to(value.message);
    }

    namespace Subscription {

        struct Board_GenerationField {

            static Operation constexpr operation = Operation::Subscription;

            static Json request() {
                Json query = R"(
                    subscription Board_Generation(
                    ) {
                        board_Generation {
                            genId
                            rows
                            cols
                            board
                        }
                    }
                )";
                Json variables;
                return {{"query", std::move(query)}, {"variables", std::move(variables)}};
            }

            using ResponseData = optional<BoardOutput>;

            static GraphqlResponse<ResponseData> response(Json const & json) {
                auto errors = json.find("errors");
                if (errors != json.end()) {
                    std::vector<GraphqlError> errorsList = *errors;
                    return errorsList;
                } else {
                    auto const & data = json.at("data");
                    auto it = data.find("board_Generation");
                    if (it != data.end()) {
                        return ResponseData(*it);
                    } else {
                        return ResponseData{};
                    }
                }
            }

        };

    } // namespace Subscription

    // Task of generating new cells in a subset of rows in GOL.
    struct Task {
        int32_t id;
        int32_t genId;
        int32_t row;
        int32_t length;
        // When found with query getNextTask as findFirst this is marked true.
        bool allocated;
        // Subset of GOL rows in generation
        std::vector<optional<BoardRow>> rows;
    };

    inline void from_json(Json const & json, Task & value) {
        json.at("id").get_to(value.id);
        json.at("genId").get_to(value.genId);
        json.at("row").get_to(value.row);
        json.at("length").get_to(value.length);
        json.at("allocated").get_to(value.allocated);
        json.at("rows").get_to(value.rows);
    }

    // Task Manager role is allocated to one client to act as task creater for GOL generations.
    struct TaskManagerRole {
        bool granted;
        std::string message;
        std::string nodeId;
        std::string nodeName;
    };

    inline void from_json(Json const & json, TaskManagerRole & value) {
        json.at("granted").get_to(value.granted);
        json.at("message").get_to(value.message);
        json.at("nodeId").get_to(value.nodeId);
        json.at("nodeName").get_to(value.nodeName);
    }

    // Task Result of generating new cells in a subset of rows in GOL.
    struct TaskResult {
        int32_t id;
        int32_t genId;
        int32_t row;
        int32_t length;
        // Subset of GOL rows in generation
        std::vector<optional<BoardRowResult>> rows;
    };

    inline void from_json(Json const & json, TaskResult & value) {
        json.at("id").get_to(value.id);
        json.at("genId").get_to(value.genId);
        json.at("row").get_to(value.row);
        json.at("length").get_to(value.length);
        json.at("rows").get_to(value.rows);
    }

    namespace Mutation {

        struct SigninTMRoleField {

            static Operation constexpr operation = Operation::Mutation;

            static Json request(std::string const & nodeId, std::string const & nodeName) {
                Json query = R"(
                    mutation SigninTMRole(
                        $nodeId: String!
                        $nodeName: String!
                    ) {
                        signinTMRole(
                            nodeId: $nodeId
                            nodeName: $nodeName
                        ) {
                            granted
                            message
                            nodeId
                            nodeName
                        }
                    }
                )";
                Json variables;
                variables["nodeId"] = nodeId;
                variables["nodeName"] = nodeName;
                return {{"query", std::move(query)}, {"variables", std::move(variables)}};
            }

            using ResponseData = TaskManagerRole;

            static GraphqlResponse<ResponseData> response(Json const & json) {
                auto errors = json.find("errors");
                if (errors != json.end()) {
                    std::vector<GraphqlError> errorsList = *errors;
                    return errorsList;
                } else {
                    auto const & data = json.at("data");
                    return ResponseData(data.at("signinTMRole"));
                }
            }

        };

        struct SignoutTMRoleField {

            static Operation constexpr operation = Operation::Mutation;

            static Json request(std::string const & nodeId) {
                Json query = R"(
                    mutation SignoutTMRole(
                        $nodeId: String!
                    ) {
                        signoutTMRole(
                            nodeId: $nodeId
                        ) {
                            granted
                            message
                            nodeId
                            nodeName
                        }
                    }
                )";
                Json variables;
                variables["nodeId"] = nodeId;
                return {{"query", std::move(query)}, {"variables", std::move(variables)}};
            }

            using ResponseData = TaskManagerRole;

            static GraphqlResponse<ResponseData> response(Json const & json) {
                auto errors = json.find("errors");
                if (errors != json.end()) {
                    std::vector<GraphqlError> errorsList = *errors;
                    return errorsList;
                } else {
                    auto const & data = json.at("data");
                    return ResponseData(data.at("signoutTMRole"));
                }
            }

        };

        struct PostTaskField {

            static Operation constexpr operation = Operation::Mutation;

            static Json request(int32_t genId, int32_t row, int32_t length, BoardRowsInput const & rows) {
                Json query = R"(
                    mutation PostTask(
                        $genId: Int!
                        $row: Int!
                        $length: Int!
                        $rows: BoardRowsInput!
                    ) {
                        postTask(
                            genId: $genId
                            row: $row
                            length: $length
                            rows: $rows
                        ) {
                            id
                            genId
                            row
                            length
                            allocated
                            rows {
                                id
                                order
                                taskId
                                cols
                            }
                        }
                    }
                )";
                Json variables;
                variables["genId"] = genId;
                variables["row"] = row;
                variables["length"] = length;
                variables["rows"] = rows;
                return {{"query", std::move(query)}, {"variables", std::move(variables)}};
            }

            using ResponseData = Task;

            static GraphqlResponse<ResponseData> response(Json const & json) {
                auto errors = json.find("errors");
                if (errors != json.end()) {
                    std::vector<GraphqlError> errorsList = *errors;
                    return errorsList;
                } else {
                    auto const & data = json.at("data");
                    return ResponseData(data.at("postTask"));
                }
            }

        };

        struct PostTaskResultField {

            static Operation constexpr operation = Operation::Mutation;

            static Json request(int32_t genId, int32_t row, int32_t length, BoardRowsInput const & rows) {
                Json query = R"(
                    mutation PostTaskResult(
                        $genId: Int!
                        $row: Int!
                        $length: Int!
                        $rows: BoardRowsInput!
                    ) {
                        postTaskResult(
                            genId: $genId
                            row: $row
                            length: $length
                            rows: $rows
                        ) {
                            id
                            genId
                            row
                            length
                            rows {
                                id
                                order
                                taskResultId
                                cols
                            }
                        }
                    }
                )";
                Json variables;
                variables["genId"] = genId;
                variables["row"] = row;
                variables["length"] = length;
                variables["rows"] = rows;
                return {{"query", std::move(query)}, {"variables", std::move(variables)}};
            }

            using ResponseData = TaskResult;

            static GraphqlResponse<ResponseData> response(Json const & json) {
                auto errors = json.find("errors");
                if (errors != json.end()) {
                    std::vector<GraphqlError> errorsList = *errors;
                    return errorsList;
                } else {
                    auto const & data = json.at("data");
                    return ResponseData(data.at("postTaskResult"));
                }
            }

        };

        struct RemoveTaskCompleteField {

            static Operation constexpr operation = Operation::Mutation;

            static Json request(int32_t genId) {
                Json query = R"(
                    mutation RemoveTaskComplete(
                        $genId: Int!
                    ) {
                        removeTaskComplete(
                            genId: $genId
                        ) {
                            message
                        }
                    }
                )";
                Json variables;
                variables["genId"] = genId;
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
                    return ResponseData(data.at("removeTaskComplete"));
                }
            }

        };

        struct PostBoardByGenIDField {

            static Operation constexpr operation = Operation::Mutation;

            static Json request(int32_t genId, int32_t rows, int32_t cols, BoardRowsInput const & board) {
                Json query = R"(
                    mutation PostBoardByGenID(
                        $genId: Int!
                        $rows: Int!
                        $cols: Int!
                        $board: BoardRowsInput!
                    ) {
                        postBoardByGenID(
                            genId: $genId
                            rows: $rows
                            cols: $cols
                            board: $board
                        ) {
                            genId
                            rows
                            cols
                            board
                        }
                    }
                )";
                Json variables;
                variables["genId"] = genId;
                variables["rows"] = rows;
                variables["cols"] = cols;
                variables["board"] = board;
                return {{"query", std::move(query)}, {"variables", std::move(variables)}};
            }

            using ResponseData = BoardOutput;

            static GraphqlResponse<ResponseData> response(Json const & json) {
                auto errors = json.find("errors");
                if (errors != json.end()) {
                    std::vector<GraphqlError> errorsList = *errors;
                    return errorsList;
                } else {
                    auto const & data = json.at("data");
                    return ResponseData(data.at("postBoardByGenID"));
                }
            }

        };

    } // namespace Mutation

    namespace Query {

        struct GetNextTaskField {

            static Operation constexpr operation = Operation::Query;

            static Json request(std::string const & nodeId) {
                Json query = R"(
                    query GetNextTask(
                        $nodeId: String!
                    ) {
                        getNextTask(
                            nodeId: $nodeId
                        ) {
                            id
                            genId
                            row
                            length
                            allocated
                            rows {
                                id
                                order
                                taskId
                                cols
                            }
                        }
                    }
                )";
                Json variables;
                variables["nodeId"] = nodeId;
                return {{"query", std::move(query)}, {"variables", std::move(variables)}};
            }

            using ResponseData = optional<std::vector<optional<Task>>>;

            static GraphqlResponse<ResponseData> response(Json const & json) {
                auto errors = json.find("errors");
                if (errors != json.end()) {
                    std::vector<GraphqlError> errorsList = *errors;
                    return errorsList;
                } else {
                    auto const & data = json.at("data");
                    auto it = data.find("getNextTask");
                    if (it != data.end()) {
                        return ResponseData(*it);
                    } else {
                        return ResponseData{};
                    }
                }
            }

        };

        struct GetTaskResultByGenIDField {

            static Operation constexpr operation = Operation::Query;

            static Json request(int32_t genId) {
                Json query = R"(
                    query GetTaskResultByGenID(
                        $genId: Int!
                    ) {
                        getTaskResultByGenID(
                            genId: $genId
                        ) {
                            id
                            genId
                            row
                            length
                            rows {
                                id
                                order
                                taskResultId
                                cols
                            }
                        }
                    }
                )";
                Json variables;
                variables["genId"] = genId;
                return {{"query", std::move(query)}, {"variables", std::move(variables)}};
            }

            using ResponseData = optional<std::vector<optional<TaskResult>>>;

            static GraphqlResponse<ResponseData> response(Json const & json) {
                auto errors = json.find("errors");
                if (errors != json.end()) {
                    std::vector<GraphqlError> errorsList = *errors;
                    return errorsList;
                } else {
                    auto const & data = json.at("data");
                    auto it = data.find("getTaskResultByGenID");
                    if (it != data.end()) {
                        return ResponseData(*it);
                    } else {
                        return ResponseData{};
                    }
                }
            }

        };

        struct CountTaskResultByGenIDField {

            static Operation constexpr operation = Operation::Query;

            static Json request(int32_t genId) {
                Json query = R"(
                    query CountTaskResultByGenID(
                        $genId: Int!
                    ) {
                        countTaskResultByGenID(
                            genId: $genId
                        )
                    }
                )";
                Json variables;
                variables["genId"] = genId;
                return {{"query", std::move(query)}, {"variables", std::move(variables)}};
            }

            using ResponseData = optional<int32_t>;

            static GraphqlResponse<ResponseData> response(Json const & json) {
                auto errors = json.find("errors");
                if (errors != json.end()) {
                    std::vector<GraphqlError> errorsList = *errors;
                    return errorsList;
                } else {
                    auto const & data = json.at("data");
                    auto it = data.find("countTaskResultByGenID");
                    if (it != data.end()) {
                        return ResponseData(*it);
                    } else {
                        return ResponseData{};
                    }
                }
            }

        };

    } // namespace Query

} // namespace golql
