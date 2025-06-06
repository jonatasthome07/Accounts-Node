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
    console.info(`Você escolheu a opção ${action}, aguarde um momento, você será redirecionado...`)
    
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

    })
}