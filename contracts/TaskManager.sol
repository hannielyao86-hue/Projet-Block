// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TaskManager {
    struct Task{
        uint256 id;
        string content;
        bool completed;
    }

    mapping(uint256 => Task) public tasks;
    uint256 public taskCount;

    event TaskCreated(uint256 id, string content);
    event TaskToggled(uint256 id, bool completed);

    function createTask(string memory _content) public {
        require(bytes(_content).length > 0, "Content cannot be empty");
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);

        emit TaskCreated(taskCount, _content);
    }

    function toggleCompleted(uint256 _id) public{
        require(_id > 0 && _id <= taskCount, "ID invalide");

        tasks[_id].completed = !tasks[_id].completed;
    }

    function getTask(uint256 _id) public view returns (Task memory){
        require(_id > 0 && _id <= taskCount, "Id invalide");
        return tasks[_id];
    } 
}