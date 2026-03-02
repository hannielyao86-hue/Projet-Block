const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TaskManager", function(){
    let taskManager;

    beforeEach(async function (){
        const TaskManager = await ethers.getContractFactory("TaskManager");
        taskManager = await TaskManager.deploy();
        await taskManager.waitForDeployment();
    });

    it("Should create a task", async function(){
        await taskManager.createTask("Learn Solidity");

        const task = await taskManager.tasks(1);

        expect(task.id).to.equal(1);
        expect(task.content).to.equal("Learn Solidity");
        expect(task.completed).to.equal(false);
    });

    it("Should increment taskCount", async function (){
        await taskManager.createTask("Task 1");
        await taskManager.createTask("Task 2");

        const count = await taskManager.taskCount();
        expect(count).to.equal(2);
    });

    it("Should toggle task completion", async function(){
        await taskManager.createTask("Test toggle");

        await taskManager.toggleCompleted(1);

        const task = await taskManager.tasks(1);
        expect(task.completed).to.equal(true);
    });

    it("Should revert if content is empty", async function(){
        await expect(taskManager.createTask(""))
            .to.be.revertedWith("Content cannot be empty");
    });

    it("Should revert if id invalid", async function (){
        await expect(taskManager.toggleCompleted(999))
            .to.be.reverted;
    });
});