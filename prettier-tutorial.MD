# Tutorial do Prettier

O Prettier é uma ferramenta de formatação de código que ajuda a manter a consistência e legibilidade do código em projetos em equipe. Quando várias pessoas trabalham em um projeto, cada desenvolvedor pode ter suas próprias preferências de formatação de código. Isso pode resultar em diferenças significativas na aparência do código e dificultar a leitura e manutenção do mesmo.

#

## Por que usar o Prettier?

Usando o Prettier no VS Code, você pode garantir que todo o código do projeto seja formatado de maneira consistente, independentemente de quem o escreveu. Isso economiza tempo e esforço, além de garantir que o código seja mais legível e fácil de manter. O Prettier também pode ajudar a evitar erros de sintaxe e estilização, pois ele segue as convenções de estilo padrão para a linguagem de programação em que você está trabalhando.

Outra vantagem do Prettier é que ele é fácil de configurar e usar no VS Code. Depois de instalado, o Prettier formatará automaticamente o código sempre que você salvar um arquivo, sem a necessidade de executar um comando separado ou se lembrar de usar uma tecla de atalho específica. Isso torna o processo de formatação de código rápido e eficiente.

Em resumo, usar o Prettier no VS Code pode melhorar a qualidade do código e tornar o processo de desenvolvimento mais rápido e eficiente.

#

## Passo a Passo

### Passo 1: Instale o Prettier

Abra o VS Code e abra a paleta de comandos **(pressione Ctrl + Shift + P ou Cmd + Shift + P no Mac)** e digite "instalar extensão". Pressione Enter e procure por _"Prettier - Code formatter"_. Clique em "Instalar".

### Passo 2: Configure o Prettier

Para configurar o Prettier, abra o arquivo **"settings.json"** do VS Code. Você pode abri-lo pressionando Ctrl + , ou Cmd + , no Mac.

Caso não apareça o arquivo JSON você também pode clicar _Ctrl + Shift + P_, depois é só procurar **"Open User Settings (JSON)"** e clicar nessa opção.

Adicione as seguintes linhas:

###### _(se você estiver vendo pelo arquivo do markdown adicione apenas as linhas 34 a 53, não adicione a linha 33 nem a linha 54 senão dá erro)_

```json
"files.autoSave": "afterDelay",
"prettier.bracketSameLine": true,
"[javascript]": {
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "editor.insertSpaces": true
},
"[html]": {
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
},
"[css]": {
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
},
"editor.codeActionsOnSave": {
  "source.fixAll": true
},
"prettier.configPath": ".prettierrc.json"
```

Isso irá configurar o VS Code para formatar automaticamente o código quando você salvar o arquivo.

### Passo 3: Use o Prettier

Para usar o Prettier, basta abrir um arquivo e digitar seu código normalmente, quando você salvar (ou seja usar o Ctrl + S), o arquivo será formatado para o padrão que estamos utilizando no projeto. Esse padrão é definido no arquivo ._prettierrc.json_ que já está no repositório do projeto. Esse é o conteúdo do arquivo:

```json
{
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

#

## O que cada atributo faz?

`printWidth`: define o comprimento máximo da linha. Se uma linha exceder esse comprimento, o Prettier tentará quebrá-la em várias linhas.

`tabWidth`: define a largura da tabulação usada para indentação.

`useTabs`: define se deve ser usada tabulação ou espaços para indentação.

`semi`: define se o Prettier deve ou não adicionar ponto e vírgula no final de cada instrução.

`singleQuote`: define se as strings devem ser formatadas com aspas simples ou duplas.

`trailingComma`: adiciona ou remove vírgula no final de um item em uma lista.

`bracketSpacing`: define se deve haver um espaço entre as chaves ({}).

`arrowParens`: define como os parênteses em torno dos parâmetros de seta devem ser formatados.

#
