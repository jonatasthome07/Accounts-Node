const fs = require("fs")
const chalk = require ("chalk")
const inquirer = require ("inquirer")

function operation(){
    inquirer.prompt([{
        type: "rawlist",
        name: "action",
        message: "O que você deseja fazer ?",
        choices: ["Criar conta", "Consultar saldo", "Depositar", "Sacar", "Sair"]
    },
    {
        type: "confirm",
        name: "choose",
        message: "Confirmar opção ?"
    }
]).then((answer)=>{
    const action = answer.action
    const choose = answer.choose
    console.log(`Você escolheu a opção ${action}, aguarde um momento, você será redirecionado...`)
    
    if(action == "Criar conta"){
        createAccount();
    }
})
.catch((err) => console.log(err))
}

operation();

function createAccount(){
    console.log(chalk.bgGreen.black("Parabéns por escolher nosso banco"))
    console.log(chalk.green("Defina as opções da sua conta a seguir"))
}