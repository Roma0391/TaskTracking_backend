"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectStatus = exports.ProjectPriorityLevel = void 0;
var ProjectPriorityLevel;
(function (ProjectPriorityLevel) {
    ProjectPriorityLevel["HIGH"] = "high";
    ProjectPriorityLevel["MEDIUM"] = "medium";
    ProjectPriorityLevel["LOW"] = "low";
})(ProjectPriorityLevel || (exports.ProjectPriorityLevel = ProjectPriorityLevel = {}));
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["ACTIVE"] = "active";
    ProjectStatus["DONE"] = "done";
    ProjectStatus["DELAY"] = "delay";
})(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
