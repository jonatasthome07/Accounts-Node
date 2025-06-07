const fs = require("fs")
const chalk = require ("chalk")
const inquirer = require ("inquirer")
const { error } = require("console")


function operation(){
    inquirer.prompt([{
        type: "rawlist",
        name: "action",
        message: "O que você deseja fazer ?",
        choices: ["Criar conta", "Consultar saldo", "Depositar", "Sacar", "Sair"]
    }
]).then((answer)=>{
    const action = answer.action
   
    if(action === "Criar conta"){
        createAccount();
    }
    else if (action === "Depositar"){
        deposit();

    }
    else if (action === "Consultar saldo"){
        getAccountBalance();
    }
    else if (action === "Sacar"){
        widthdraw();
    }
    else if (action === "Sair"){
        inquirer.prompt([
            {
                type:"list",
                name: "resp",
                message: "Realmente deseja sair ?",
                choices: ["Sim", "Não"]

            }
        ]).then((answer)=>{
            const escolha = answer.resp
            if (escolha === "Sim"){
                console.log(chalk.blue("Obrigado por usar o Accounts! Até logo!"))
                process.exit();
            }
            else {
                operation();
            }
        })
    }
})
.catch((err) => console.log(err))
}

operation();

function createAccount(){
    console.log(chalk.bgGreen.black("Parabéns por escolher nosso banco"))
    console.log(chalk.green("Defina as opções da sua conta a seguir"))

    buildAccount();
}

function buildAccount(){
    inquirer.prompt([
        {
            name: "accountName",
            message: "Digite um nome para a sua conta"
        }
    ]).then((answer)=>{
        const accountName = answer.accountName 
        console.info(accountName)

        if (!fs.existsSync("accounts")){
            fs.mkdirSync("accounts")
        }

        if (fs.existsSync(`accounts/${accountName}.json`)){
            console.log(chalk.bgRed.black("Essa conta já existe, escolha outro nome."))
            buildAccount();
            return;
        }
        
        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', function(err){
            console.log(err)
        })
        
        console.log(chalk.green("Parabéns, a sua conta foi criada!"))
        operation();
    }).catch((err) =>{
        console.log(err)
    })
}

function deposit(){
    inquirer.prompt([
        {
            name: "accountName",
            message: "Qual o nome da sua conta ?"
        }
    ]).then((answer)=>{
        const accoutName = answer.accountName
        if (!checkAccount(accoutName)){
            inquirer.prompt([
                {
                    name: "amount",
                    message: "Quanto você deseja depositar ?"
                }
            ]).then((answer) =>{
                const amount = answer.amount
                addAmount(accoutName, amount)
            }).catch((err)=>{
                console.log(err)
            })
        }
    })
    .catch((err) =>{
        console.log(err)
    })
}

function checkAccount (accountName){
    if(!fs.existsSync(`accounts/${accountName}.json`)){
        inquirer.prompt([
            {
                type: "list",
                name: "choose",
                message: "Conta inexistente, deseja criar uma ?",
                choices : ["Sim", "Não"]
            }
        ]).then((answer)=>{
            if(answer.choose === "Sim"){
                buildAccount();
            }
            else{
                operation(); 
            }
        }).catch((err)=>{
            console.log(err)
        })
    }
}

function addAmount(accountName, amount){
    const account = getAccount(accountName)
    if (!amount){
        console.log(chalk.red("Ocorreu um erro! Tente novamente mais tarde"))
        return deposit();
    }
    account.balance = parseFloat(amount) + parseFloat(account.balance)
    fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(account))

    console.log(chalk.green(`Depósito de R$${amount} realizado com sucesso!`))
    operation();
}

function getAccount (accountName){
    const accountJson = fs.readFileSync(`accounts/${accountName}.json`, {encoding: "utf8", flag: "r"})
    return JSON.parse(accountJson)
}

function getAccountBalance(){
    inquirer.prompt([
        {
            name: "accountName",
            message: "Qual o nome da sua conta ?"
        }
    ]).then((answer)=>{
        const accountName = answer.accountName
        if(!fs.existsSync(`accounts/${accountName}.json`)){
            checkAccount();
            return;
        }
        const accountData = getAccount(accountName)
        console.log(chalk.bgBlue.black(`Olá ${accountName}, o saldo da sua conta é R$${accountData.balance}`))
        operation();
        
    }).catch((error)=>{
        console.log(error)
    })
}

function widthdraw(){
    inquirer.prompt([
        {
            name:"accountName",
            message:"Qual o nome da sua conta ?"
        }
    ]).then((answer)=>{
        const accountName = answer.accountName
        if(!fs.existsSync(`accounts/${accountName}.json`)){
           checkAccount();
           return;
        }

        inquirer.prompt([
            {
                name: "amount",
                message: "Quanto você deseja sacar ?"
            }
        ]).then((answer)=>{
            const amount = answer.amount
            console.log(amount)
            operation();

        }).catch((err)=>{
            console.log(err)
        })

    }).catch((err)=>{
        console.log(err)
    })
}