@echo off
echo Baixando dependências do back-end...
cd PokeQuiz-API
call npm install
echo.
echo Dependências do back-end instaladas.
echo.

echo Baixando dependências do front-end...
cd ..
cd PokeQuiz-Front
call npm install
echo.
echo Dependências do front-end instaladas.
echo.

echo Configuracao completa!
pause