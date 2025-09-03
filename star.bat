@echo off
echo Iniciando o servidor back-end...
start cmd /k "cd PokeQuiz-API && npm start"
echo.

echo Iniciando o servidor front-end...
start cmd /k "cd PokeQuiz-Front && npm start"
echo.

echo Ambos os servidores foram iniciados.
echo Pressione qualquer tecla para fechar esta janela...
pause > nul