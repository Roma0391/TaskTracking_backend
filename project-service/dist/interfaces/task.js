"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskStatus = exports.TaskPriorityLevel = void 0;
var TaskPriorityLevel;
(function (TaskPriorityLevel) {
    TaskPriorityLevel["HIGH"] = "high";
    TaskPriorityLevel["MEDIUM"] = "medium";
    TaskPriorityLevel["LOW"] = "low";
})(TaskPriorityLevel || (exports.TaskPriorityLevel = TaskPriorityLevel = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["TODO"] = "todo";
    TaskStatus["IN_PROGRESS"] = "inProgress";
    TaskStatus["DONE"] = "done";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
