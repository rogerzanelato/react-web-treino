# Resumo
Exemplo de BoilerPlate básico para desenvolvimento e deploy baseado em Shell.

## Executando o Projeto Desenvolvimento
```shell
# Faz o primeiro build
sh scripts/build.sh

# Escuta alterações e realiza o build automaticamente
sh scripts/watch.sh
```

## Deploy da Aplicação
```shell
sh scripts/deploy.sh
```

# Anotações

## Preparando o BoilerPlate

### Browserify
Utilizado para concatenar Scripts, resolver e incluir todas as dependências, apenas passamos o path inicial do javascript ele cuidará do resto.

Obs: É necessário incluir uma implementação de CommonJS para fazer as chamadas de require funcionar, pois o babel transforma todas as instruções *import* em chamadas de função require.

```shell
npm install --global browserify

browserify --version
```

### Babel
Permite que utilizemos as mais recentes propostas e atualizações do ECMAScript de forma que ainda funcione em navegadores antigos. Faz a *transpilação* do nosso código.

```shell
npm install --global babel-cli

babel --version
```

### Uglify
Minifica arquivos JS.
```shell
npm install --global uglify

uglify --version
```

### Cssshrink
Minifica arquivos CSS.
```shell
npm install --global cssshrink
```

### Outros pacotes
```shell
yarn add --dev react
yarn add --dev react-dom
yarn add --dev babel-preset-react
yarn add --dev babel-preset-es2015
yarn add --dev watch
```

## Efetuando a Construção (build)
O processo de construção deve executar três tarefas: concatenação do CSS, transpilação de JS e empacotamento de JS.

Esse processo se resume à 3 comandos:
- Transpilar o JavaScript com o Babel
```shell
babel --presets react,es2015 js/source -d js/build
```
O comando acima captura todos os arquivos de js/source, transpira usando react e os recursos do es2015 e copia para js/build

- Empacotar o JavaScript
```shell
browserify js/build/app.js -o bundle.js
```
O comando acima irá começar por app.js, seguir todas as dependências e escrever o resultado em bundle.js.

- Empacotar o CSS
O empacotamento do CSS é simples, para o projeto atual, podemos fazê-lo usando apenas a linha de comando, embora, precisemos alterar a o path da imagens com *sed*;
```shell
cat css/*/* css/*.css | sed 's/..\/..\/images/images/g' > bundle.css
```
Obs: *sed s/* irá efetuar alterações na string de saída, básicamente ../../images irá virar images/. A barra invertida (/) é o delimitar. Por isso, para utilizá-la na expressão regular precisamos escapá-la.


### Watch
O Pacote Watch permite monitorar as alterações e executar alguma ao detectá-las.
```shell
watch "sh scripts/build.sh" js/source css
```
Obs: Podemos colocar o comando acima em um arquivo .sh também.
