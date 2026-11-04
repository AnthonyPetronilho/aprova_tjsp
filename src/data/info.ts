import type { Flashcard, Lesson, Question } from '../types'
import { o, mkQ, mkC, spread, step } from './helpers'
// Informática (Anexo VIII): Windows, Word, Excel, e-mail, Internet, Teams e OneDrive.
// Menus mudam entre versões do Microsoft 365; os atalhos e conceitos abaixo são os estáveis. Confirme na versão que a prova indicar.

// ───────── info-1
export const WIN_LESSON: Lesson = {
  id: 'info-windows', topicId: 'info-1', title: 'MS-Windows 10 ou superior: arquivos, atalhos e configurações', questionIds: ['win-1', 'win-2', 'win-3', 'win-4', 'win-5'],
  steps: [
    step('Entenda', ['O Windows é o sistema operacional: ele gerencia hardware, programas, arquivos e usuários. O Explorador de Arquivos organiza pastas e arquivos; as Configurações (Win + I) concentram ajustes de sistema, contas, rede e aplicativos; o Gerenciador de Tarefas mostra e encerra processos.',
      'Arquivos excluídos normalmente vão para a Lixeira e podem ser restaurados. Isso NÃO vale para Shift + Delete (exclusão permanente) nem, em geral, para arquivos de pen drives e unidades de rede, que são removidos sem passar pela Lixeira.',
      'Atalhos que mais caem: Ctrl + C (copiar), Ctrl + X (recortar), Ctrl + V (colar), Ctrl + Z (desfazer), Alt + Tab (alternar janelas), Win + D (área de trabalho), Win + E (Explorador), Win + L (bloquear), Win + R (Executar), Ctrl + Shift + Esc (Gerenciador de Tarefas), F2 (renomear), F5 (atualizar), Win + Shift + S (recorte de tela).'],
      'Pense no Explorador de Arquivos como o armário e na Lixeira como a caixa de papelão ao lado dele: o que vai para a caixa pode ser resgatado, mas Shift + Delete joga fora de vez.'),
    step('Exemplo prático', ['Caso 1: renomear um arquivo selecionado → F2.',
      'Caso 2: sair da mesa por um momento sem encerrar os programas → Win + L bloqueia a sessão.',
      'Caso 3: um programa travou → Ctrl + Shift + Esc abre o Gerenciador de Tarefas, onde é possível encerrar o processo.',
      'Caso 4: apagar um arquivo da área de trabalho com Delete → vai para a Lixeira; com Shift + Delete → é excluído permanentemente (após confirmação).',
      'Caso 5: alternar entre dois programas abertos → Alt + Tab.'],
      'Em questões de atalho, ligue a letra à ideia: L de Lock (bloquear), E de Explorador, R de Run (Executar), D de Desktop.'),
    step('Resumo essencial', ['Atalhos do Windows.'], undefined, { caption: 'Atalhos', head: ['Atalho', 'Função', 'Obs.'], rows: [
      ['Win + L', 'Bloquear o computador', 'Mantém os programas abertos'],
      ['Win + E', 'Abrir o Explorador de Arquivos', ''],
      ['Win + D', 'Mostrar a área de trabalho', ''],
      ['Alt + Tab', 'Alternar entre janelas', ''],
      ['Ctrl + Shift + Esc', 'Abrir o Gerenciador de Tarefas', ''],
      ['Shift + Delete', 'Excluir sem enviar à Lixeira', 'Permanente'],
      ['F2', 'Renomear', ''],
      ['Win + I', 'Abrir Configurações', '']] }),
    step('O que memorizar', ['• Lixeira guarda arquivos excluídos do disco local; Shift + Delete pula a Lixeira.',
      '• Arquivos de pen drive e de rede, em geral, não vão para a Lixeira.',
      '• Ctrl + Z desfaz; Ctrl + C/X/V copia, recorta e cola.',
      '• Gerenciador de Tarefas: Ctrl + Shift + Esc.',
      '• Win + L bloqueia sem fechar os programas.'] ),
  ],
}
const wq = mkQ('win', 'info-1')
export const WIN_QUESTIONS: Question[] = [
  wq(1, 'No Windows, para excluir um arquivo permanentemente, sem enviá-lo à Lixeira, o usuário seleciona o arquivo e pressiona', [
    o('A', 'Delete.', 'Errada: Delete envia o arquivo para a Lixeira.'),
    o('B', 'Ctrl + Delete.', 'Errada: não é o atalho de exclusão permanente.'),
    o('C', 'Shift + Delete.', 'Correta: exclui sem passar pela Lixeira, após confirmação.'),
    o('D', 'Alt + Delete.', 'Errada: não é um atalho de exclusão.'),
    o('E', 'Ctrl + Z.', 'Errada: desfaz a última ação, e não exclui.')], 'C', 'Fácil'),
  wq(2, 'O atalho Win + L, no Windows, tem como função', [
    o('A', 'abrir o Explorador de Arquivos.', 'Errada: o atalho do Explorador é Win + E.'),
    o('B', 'bloquear o computador, mantendo os programas abertos.', 'Correta: L de Lock; exige a senha para retornar à sessão.'),
    o('C', 'desligar o computador.', 'Errada: bloquear não desliga a máquina.'),
    o('D', 'abrir a janela Executar.', 'Errada: o atalho do Executar é Win + R.'),
    o('E', 'mostrar a área de trabalho.', 'Errada: o atalho é Win + D.')], 'B', 'Fácil'),
  wq(3, 'O atalho que abre diretamente o Gerenciador de Tarefas do Windows é', [
    o('A', 'Ctrl + Shift + Esc.', 'Correta: abre o Gerenciador de Tarefas.'),
    o('B', 'Win + E.', 'Errada: abre o Explorador de Arquivos.'),
    o('C', 'Alt + Tab.', 'Errada: alterna entre janelas.'),
    o('D', 'Win + I.', 'Errada: abre as Configurações.'),
    o('E', 'F5.', 'Errada: atualiza a janela ou o conteúdo exibido.')], 'A', 'Médio'),
  wq(4, 'Em regra, um arquivo excluído de um pen drive conectado ao computador', [
    o('A', 'vai para a Lixeira do Windows e pode ser restaurado.', 'Errada: em geral, arquivos de unidades removíveis não passam pela Lixeira.'),
    o('B', 'é removido sem passar pela Lixeira do Windows.', 'Correta: comportamento padrão para unidades removíveis e de rede.'),
    o('C', 'é movido para a pasta Documentos.', 'Errada: não há movimentação para Documentos.'),
    o('D', 'é copiado para a nuvem automaticamente.', 'Errada: a exclusão não envia o arquivo para a nuvem.'),
    o('E', 'só pode ser excluído com Shift + Delete.', 'Errada: a tecla Delete também o exclui, mas sem passar pela Lixeira.')], 'B', 'Médio'),
  wq(5, 'Para alternar rapidamente entre os programas abertos, o usuário do Windows pode utilizar', [
    o('A', 'Ctrl + Tab.', 'Errada: alterna entre abas dentro de um programa, em geral.'),
    o('B', 'Win + D.', 'Errada: mostra a área de trabalho.'),
    o('C', 'Alt + Tab.', 'Correta: alterna entre as janelas abertas.'),
    o('D', 'Ctrl + Alt + Del.', 'Errada: abre a tela de opções de segurança.'),
    o('E', 'Win + L.', 'Errada: bloqueia o computador.')], 'C', 'Fácil'),
]
const wc = mkC('win', 'info-1', 'info-windows')
export const WIN_CARDS: Flashcard[] = [
  wc(1, 'Para que serve Shift + Delete?', 'Excluir o arquivo permanentemente, sem enviá-lo à Lixeira.'),
  wc(2, 'O que faz Win + L?', 'Bloqueia o computador, mantendo os programas abertos.'),
  wc(3, 'Atalho do Gerenciador de Tarefas?', 'Ctrl + Shift + Esc.'),
  wc(4, 'Arquivos de pen drive vão para a Lixeira?', 'Em regra, não: são excluídos sem passar por ela.'),
  wc(5, 'Atalho para alternar janelas?', 'Alt + Tab.'),
  wc(6, 'Atalho do Explorador de Arquivos e das Configurações?', 'Win + E e Win + I.'),
]

// ───────── info-2
export const WORD_LESSON: Lesson = {
  id: 'info-word', topicId: 'info-2', title: 'MS-Word: guias, formatação e atalhos', questionIds: ['word-1', 'word-2', 'word-3', 'word-4', 'word-5'],
  steps: [
    step('Entenda', ['O Word é o editor de textos do Microsoft Office/365 (arquivos .docx). Sua faixa de opções é dividida em guias: Arquivo, Página Inicial (fonte, parágrafo, estilos), Inserir (tabela, imagem, cabeçalho e rodapé, número de página), Design, Layout (margens, orientação, colunas), Referências (sumário, notas de rodapé, legendas), Correspondências (mala direta), Revisão (ortografia, comentários, controle de alterações) e Exibir.',
      'Atalhos no Word em português do Brasil: Ctrl + N (negrito), Ctrl + I (itálico), Ctrl + S (sublinhado), Ctrl + B (salvar), Ctrl + O (novo documento), Ctrl + A (abrir), Ctrl + T (selecionar tudo), Ctrl + P (imprimir), Ctrl + L (localizar), Ctrl + U (substituir), Ctrl + Z (desfazer), Ctrl + Y (refazer), Ctrl + Enter (quebra de página), Shift + Enter (quebra de linha). Atenção: esses atalhos de letra são os da versão em português; nas versões em inglês, as letras são outras (por exemplo, Ctrl + B é negrito).',
      'O Pincel de Formatação copia a formatação de um trecho para outro. O sumário automático depende de títulos aplicados com os Estilos (Título 1, Título 2…).'],
      'Associe a guia à tarefa: o que ENTRA no documento (tabela, cabeçalho, imagem) está em Inserir; o que mexe na PÁGINA (margens, orientação) está em Layout; o que CORRIGE (ortografia, comentários, alterações) está em Revisão.'),
    step('Exemplo prático', ['Caso 1: colocar o número da página no rodapé → guia Inserir.',
      'Caso 2: gerar o sumário → aplicar estilos de título e usar Referências > Sumário.',
      'Caso 3: iniciar uma nova página sem apertar Enter várias vezes → Ctrl + Enter.',
      'Caso 4: mostrar o que foi alterado por cada revisor → Revisão > Controle de Alterações.',
      'Caso 5: mudar a orientação da página para paisagem → Layout.'],
      'Em prova, confirme se a questão fala de Word em português; é nesse caso que Ctrl + N é negrito.'),
    step('Resumo essencial', ['Guias do Word.'], undefined, { caption: 'Guias', head: ['Guia', 'O que concentra', 'Exemplo'], rows: [
      ['Página Inicial', 'Fonte, parágrafo, estilos, área de transferência', 'Negrito, alinhamento'],
      ['Inserir', 'Elementos novos', 'Tabela, imagem, cabeçalho/rodapé'],
      ['Layout', 'Configuração da página', 'Margens, orientação, colunas'],
      ['Referências', 'Itens de documentos longos', 'Sumário, notas de rodapé'],
      ['Correspondências', 'Mala direta', 'Etiquetas, cartas'],
      ['Revisão', 'Correção e colaboração', 'Ortografia, comentários, alterações']] }),
    step('O que memorizar', ['• Sumário: Referências (com estilos de título).',
      '• Cabeçalho, rodapé, tabela e imagem: Inserir.',
      '• Margens e orientação: Layout.',
      '• Controle de alterações e comentários: Revisão.',
      '• Quebra de página: Ctrl + Enter.',
      '• Word em português: Ctrl + N negrito, Ctrl + I itálico, Ctrl + S sublinhado, Ctrl + B salvar.'] ),
  ],
}
const dq = mkQ('word', 'info-2')
export const WORD_QUESTIONS: Question[] = [
  dq(1, 'No MS-Word em português, o atalho Ctrl + N aplica ao texto selecionado', [
    o('A', 'itálico.', 'Errada: o itálico é Ctrl + I.'),
    o('B', 'sublinhado.', 'Errada: o sublinhado é Ctrl + S.'),
    o('C', 'negrito.', 'Correta: na versão em português, Ctrl + N é negrito.'),
    o('D', 'um novo documento em branco.', 'Errada: o novo documento é Ctrl + O.'),
    o('E', 'a gravação do arquivo.', 'Errada: salvar é Ctrl + B.')], 'C', 'Médio'),
  dq(2, 'No MS-Word, a inserção de cabeçalho e rodapé é feita na guia', [
    o('A', 'Página Inicial.', 'Errada: concentra fonte, parágrafo e estilos.'),
    o('B', 'Layout.', 'Errada: concentra margens, orientação e colunas.'),
    o('C', 'Revisão.', 'Errada: concentra ortografia, comentários e alterações.'),
    o('D', 'Inserir.', 'Correta: Inserir > Cabeçalho/Rodapé.'),
    o('E', 'Exibir.', 'Errada: controla o modo de visualização do documento.')], 'D', 'Fácil'),
  dq(3, 'Para criar um sumário automático em um documento do MS-Word, o usuário deve aplicar estilos de título ao texto e utilizar a guia', [
    o('A', 'Referências.', 'Correta: Referências > Sumário.'),
    o('B', 'Correspondências.', 'Errada: é a guia da mala direta.'),
    o('C', 'Exibir.', 'Errada: controla modos de exibição.'),
    o('D', 'Revisão.', 'Errada: é a guia de correção e comentários.'),
    o('E', 'Arquivo.', 'Errada: reúne ações como salvar, imprimir e exportar.')], 'A', 'Médio'),
  dq(4, 'Para iniciar uma nova página a partir de determinado ponto do texto, no MS-Word, utiliza-se o atalho', [
    o('A', 'Shift + Enter.', 'Errada: insere quebra de linha, e não de página.'),
    o('B', 'Ctrl + Enter.', 'Correta: insere quebra de página.'),
    o('C', 'Ctrl + P.', 'Errada: abre a impressão.'),
    o('D', 'Alt + Enter.', 'Errada: não é o atalho de quebra de página.'),
    o('E', 'Ctrl + L.', 'Errada: abre a localização de texto.')], 'B', 'Fácil'),
  dq(5, 'O recurso do MS-Word que registra e mostra as modificações feitas por cada revisor está na guia', [
    o('A', 'Inserir.', 'Errada: concentra os elementos que entram no documento.'),
    o('B', 'Layout.', 'Errada: trata da configuração da página.'),
    o('C', 'Revisão.', 'Correta: Revisão > Controle de Alterações.'),
    o('D', 'Referências.', 'Errada: concentra sumário e notas.'),
    o('E', 'Design.', 'Errada: trata de temas e aparência do documento.')], 'C', 'Fácil'),
]
const dc = mkC('word', 'info-2', 'info-word')
export const WORD_CARDS: Flashcard[] = [
  dc(1, 'Em qual guia ficam cabeçalho, rodapé, tabela e imagem?', 'Inserir.'),
  dc(2, 'Onde se cria o sumário automático?', 'Guia Referências, depois de aplicar estilos de título.'),
  dc(3, 'Onde ficam margens e orientação da página?', 'Guia Layout.'),
  dc(4, 'Onde ficam ortografia, comentários e controle de alterações?', 'Guia Revisão.'),
  dc(5, 'Atalho de quebra de página?', 'Ctrl + Enter.'),
  dc(6, 'No Word em português, Ctrl + N, Ctrl + I, Ctrl + S e Ctrl + B?', 'Negrito, itálico, sublinhado e salvar.'),
]

// ───────── info-3
export const XL_LESSON: Lesson = {
  id: 'info-excel', topicId: 'info-3', title: 'MS-Excel: fórmulas, funções e referências', questionIds: ['xl-1', 'xl-2', 'xl-3', 'xl-4', 'xl-5'],
  steps: [
    step('Entenda', ['O Excel é a planilha eletrônica do Microsoft Office/365 (arquivos .xlsx). Uma pasta de trabalho tem planilhas; cada planilha tem células identificadas por coluna e linha (A1, B2). Toda fórmula começa com o sinal de igual (=). No Excel em português, o separador de argumentos é o ponto e vírgula (;).',
      'Funções principais: SOMA, MÉDIA, MÁXIMO, MÍNIMO, SE, CONT.NÚM (conta números), CONT.VALORES (conta células não vazias), CONT.SE, SOMASE e PROCV. Intervalo usa dois-pontos (A1:A4); união usa ponto e vírgula (A1;A4). Ordem de cálculo: parênteses, potência, multiplicação/divisão, soma/subtração (=2+3*4 dá 14).',
      'Referências: RELATIVA (A1) muda ao copiar a fórmula; ABSOLUTA ($A$1) fica fixa; MISTA ($A1 ou A$1) fixa só a coluna ou só a linha. Erros comuns: #DIV/0! (divisão por zero), #NOME? (nome de função ou intervalo inválido), #REF! (referência inválida), #VALOR! (tipo de dado incorreto).'],
      'Ao copiar uma fórmula uma linha para baixo, as referências relativas descem uma linha; o cifrão ($) é o "cadeado" que impede o movimento.'),
    step('Exemplo prático', ['Caso 1: A1 = 10, A2 = 20, A3 = 30 → =SOMA(A1:A3) resulta em 60 e =MÉDIA(A1:A3) resulta em 20.',
      'Caso 2: =SE(A1>15;"Alto";"Baixo") com A1 = 10 resulta em "Baixo".',
      'Caso 3: em C1, =A1+B1. Copiando C1 para C3, a fórmula vira =A3+B3.',
      'Caso 4: em C1, =A1*$B$1. Copiando para C2, vira =A2*$B$1 (B1 fixa).',
      'Caso 5: A1 = 4, A2 = 8, A3 vazia e A4 = 6 → =MÉDIA(A1:A4) = 18 ÷ 3 = 6, porque a célula vazia é ignorada (não conta como zero).'],
      'Na MÉDIA, células vazias e textos são ignorados; uma célula com o número 0 é contada.'),
    step('Resumo essencial', ['Funções e referências.'], undefined, { caption: 'Excel', head: ['Item', 'Significado', 'Exemplo'], rows: [
      ['=SOMA(A1:A3)', 'Soma o intervalo', '10+20+30 = 60'],
      ['=MÉDIA(A1:A3)', 'Média aritmética', '20'],
      ['=SE(teste;verdadeiro;falso)', 'Decisão', '=SE(A1>15;"Alto";"Baixo")'],
      ['A1 / $A$1 / $A1', 'Relativa / absoluta / mista', 'Cifrão fixa'],
      ['A1:A4 e A1;A4', 'Intervalo e união', ''],
      ['#DIV/0!', 'Divisão por zero', '']] }),
    step('O que memorizar', ['• Fórmula sempre começa com =.',
      '• Separador em português: ponto e vírgula.',
      '• Relativa muda ao copiar; $ fixa linha ou coluna.',
      '• CONT.NÚM conta números; CONT.VALORES conta células preenchidas.',
      '• Ordem: parênteses, potência, × ÷, + −.',
      '• MÉDIA ignora células vazias.'] ),
  ],
}
const xq = mkQ('xl', 'info-3')
export const XL_QUESTIONS: Question[] = [
  xq(1, 'Em uma planilha do MS-Excel, as células A1, A2 e A3 contêm 10, 20 e 30. O resultado da fórmula =SOMA(A1:A3) é', [
    o('A', '20.', 'Errada: é o resultado da MÉDIA, e não da SOMA.'),
    o('B', '30.', 'Errada: é o valor de A3 (ou o MÁXIMO).'),
    o('C', '50.', 'Errada: corresponde a A2 + A3, sem A1.'),
    o('D', '60.', 'Correta: 10 + 20 + 30 = 60.'),
    o('E', '#VALOR!', 'Errada: o intervalo contém apenas números; não há erro.')], 'D', 'Fácil'),
  xq(2, 'Se a célula A1 contém o número 10, a fórmula =SE(A1>15;"Alto";"Baixo") retorna', [
    o('A', 'Alto.', 'Errada: 10 não é maior que 15; o teste é falso.'),
    o('B', 'Baixo.', 'Correta: o teste é falso e retorna o terceiro argumento.'),
    o('C', 'VERDADEIRO.', 'Errada: a função SE retorna os textos indicados, e não VERDADEIRO.'),
    o('D', '10.', 'Errada: a função não retorna o valor da célula.'),
    o('E', '#NOME?', 'Errada: a sintaxe está correta.')], 'B', 'Fácil'),
  xq(3, 'Na célula C1 há a fórmula =A1+B1. Ao copiar C1 e colar em C3, a fórmula resultante em C3 é', [
    o('A', '=A1+B1.', 'Errada: só ocorreria com referências absolutas.'),
    o('B', '=A2+B2.', 'Errada: seria o resultado da colagem em C2.'),
    o('C', '=A3+B3.', 'Correta: as referências relativas descem duas linhas.'),
    o('D', '=$A$3+$B$3.', 'Errada: não há cifrão na fórmula original.'),
    o('E', '=C3+C3.', 'Errada: a fórmula não passa a referenciar a própria célula.')], 'C', 'Médio'),
  xq(4, 'Na célula C1 está a fórmula =A1*$B$1. Ao copiá-la para C2, a fórmula em C2 será', [
    o('A', '=A2*$B$2.', 'Errada: $B$1 é absoluta e não muda.'),
    o('B', '=A1*$B$1.', 'Errada: A1 é relativa e desce para A2.'),
    o('C', '=A2*B2.', 'Errada: o cifrão mantém B1 fixa.'),
    o('D', '=A2*$B$1.', 'Correta: A1 acompanha a linha; $B$1 fica fixa.'),
    o('E', '=$A$2*B1.', 'Errada: troca o tipo de cada referência.')], 'D', 'Médio'),
  xq(5, 'Em uma planilha, A1 = 4, A2 = 8, A3 está vazia e A4 = 6. O resultado de =MÉDIA(A1:A4) é', [
    o('A', '4,5.', 'Errada: dividiu 18 por 4, tratando a célula vazia como zero.'),
    o('B', '6.', 'Correta: a função ignora a célula vazia; 18 ÷ 3 = 6.'),
    o('C', '7.', 'Errada: é a média apenas de A2 e A4.'),
    o('D', '18.', 'Errada: é a soma, e não a média.'),
    o('E', '#DIV/0!', 'Errada: há valores numéricos no intervalo.')], 'B', 'Difícil'),
]
const xc = mkC('xl', 'info-3', 'info-excel')
export const XL_CARDS: Flashcard[] = [
  xc(1, 'Com que sinal começa uma fórmula do Excel?', 'Com o sinal de igual (=).'),
  xc(2, 'Qual o separador de argumentos no Excel em português?', 'Ponto e vírgula (;).'),
  xc(3, 'Diferença entre A1, $A$1 e $A1?', 'Relativa (muda ao copiar), absoluta (fixa) e mista (fixa só a coluna).'),
  xc(4, 'Diferença entre CONT.NÚM e CONT.VALORES?', 'CONT.NÚM conta só números; CONT.VALORES conta células não vazias.'),
  xc(5, 'A MÉDIA conta células vazias como zero?', 'Não: ignora células vazias e textos.'),
  xc(6, 'O que significa #DIV/0!?', 'Divisão por zero.'),
]

// ───────── info-4
export const MAIL_LESSON: Lesson = {
  id: 'info-email', topicId: 'info-4', title: 'Correio eletrônico: campos, protocolos e segurança', questionIds: ['mail-1', 'mail-2', 'mail-3', 'mail-4', 'mail-5'],
  steps: [
    step('Entenda', ['Campos da mensagem: Para (destinatários principais), Cc (cópia, visível a todos) e Cco (cópia oculta; os demais não veem quem está em Cco). Assunto e corpo da mensagem completam o e-mail, que pode ter anexos.',
      'Ações: Responder (só ao remetente), Responder a todos (remetente e todos de Para e Cc; quem está em Cco não é incluído por quem recebeu) e Encaminhar (envia a mensagem recebida a outras pessoas). Pastas típicas: Caixa de Entrada, Itens Enviados, Rascunhos, Itens Excluídos e Lixo Eletrônico (spam).',
      'Protocolos: SMTP é usado para ENVIAR; POP3 baixa as mensagens para o computador (em geral removendo-as do servidor); IMAP acessa e sincroniza as mensagens mantendo-as no servidor, o que permite ver a mesma caixa em vários dispositivos. Segurança: phishing é a mensagem fraudulenta que tenta enganar para obter dados ou instalar malware; desconfie de links e anexos inesperados.'],
      'Pense em Cco como a "cópia carbono invisível": quem recebe a mensagem não sabe quem mais a recebeu por esse campo.'),
    step('Exemplo prático', ['Caso 1: enviar um aviso a vários colegas sem expor os endereços uns dos outros → colocar os destinatários em Cco.',
      'Caso 2: um e-mail chega para você, Ana e Bia; ao clicar em Responder a todos, a resposta vai ao remetente, Ana e Bia.',
      'Caso 3: receber uma mensagem "do banco" pedindo senha por link → provável phishing; não clicar.',
      'Caso 4: ler o mesmo e-mail no celular e no computador, com ambos sincronizados → IMAP.',
      'Caso 5: o programa de e-mail envia uma mensagem para o servidor → SMTP.'],
      'Gravar: S de SMTP lembra "send" (enviar). POP3 e IMAP são os de recebimento.'),
    step('Resumo essencial', ['Campos e protocolos.'], undefined, { caption: 'E-mail', head: ['Item', 'Função', 'Obs.'], rows: [
      ['Para', 'Destinatário principal', 'Visível'],
      ['Cc', 'Com cópia', 'Visível'],
      ['Cco', 'Com cópia oculta', 'Os demais não veem'],
      ['SMTP', 'Envio', ''],
      ['POP3', 'Recebimento (baixa as mensagens)', 'Em geral remove do servidor'],
      ['IMAP', 'Recebimento (sincroniza)', 'Mantém no servidor']] }),
    step('O que memorizar', ['• Cco oculta destinatários dos demais.',
      '• SMTP envia; POP3 e IMAP recebem.',
      '• IMAP mantém as mensagens no servidor e sincroniza dispositivos.',
      '• Responder a todos alcança remetente + Para + Cc.',
      '• Phishing: fraude por mensagem; desconfie de links e anexos.'] ),
  ],
}
const mq2 = mkQ('mail', 'info-4')
export const MAIL_QUESTIONS: Question[] = [
  mq2(1, 'Ao enviar uma mensagem de correio eletrônico, o campo que permite incluir destinatários sem que os demais vejam seus endereços é o', [
    o('A', 'Para.', 'Errada: os endereços de Para são visíveis a todos.'),
    o('B', 'Cc.', 'Errada: Cc significa com cópia, mas os endereços aparecem para todos.'),
    o('C', 'Cco.', 'Correta: cópia oculta; os demais destinatários não veem esses endereços.'),
    o('D', 'Assunto.', 'Errada: é o título da mensagem.'),
    o('E', 'Anexo.', 'Errada: serve para incluir arquivos.')], 'C', 'Fácil'),
  mq2(2, 'Uma mensagem foi enviada por João para Maria (Para) e Pedro (Cc). Ao usar "Responder a todos", Maria envia a resposta para', [
    o('A', 'João apenas.', 'Errada: essa é a ação Responder.'),
    o('B', 'Pedro apenas.', 'Errada: a resposta também vai ao remetente.'),
    o('C', 'João e Pedro.', 'Correta: remetente e demais destinatários, exceto ela mesma.'),
    o('D', 'ninguém, pois exige Cco.', 'Errada: a função não depende de Cco.'),
    o('E', 'somente aos destinatários em Cco.', 'Errada: não há destinatários em Cco neste caso.')], 'C', 'Médio'),
  mq2(3, 'O protocolo utilizado para o ENVIO de mensagens de correio eletrônico é o', [
    o('A', 'POP3.', 'Errada: é protocolo de recebimento.'),
    o('B', 'IMAP.', 'Errada: é protocolo de recebimento e sincronização.'),
    o('C', 'FTP.', 'Errada: serve para transferência de arquivos.'),
    o('D', 'SMTP.', 'Correta: Simple Mail Transfer Protocol, usado para enviar.'),
    o('E', 'HTTPS.', 'Errada: é o protocolo seguro de páginas da web.')], 'D', 'Fácil'),
  mq2(4, 'Uma mensagem aparentemente de um banco pede que o usuário clique em um link e informe sua senha. Esse tipo de golpe é conhecido como', [
    o('A', 'phishing.', 'Correta: mensagem fraudulenta que tenta obter dados do usuário.'),
    o('B', 'firewall.', 'Errada: é uma barreira de proteção de rede, e não um golpe.'),
    o('C', 'backup.', 'Errada: é cópia de segurança de dados.'),
    o('D', 'cache.', 'Errada: é armazenamento temporário de dados.'),
    o('E', 'proxy.', 'Errada: é um intermediário de conexões.')], 'A', 'Fácil'),
  mq2(5, 'O protocolo que permite acessar as mensagens mantendo-as no servidor e sincronizadas entre vários dispositivos é o', [
    o('A', 'SMTP.', 'Errada: serve para envio.'),
    o('B', 'POP3.', 'Errada: em geral baixa as mensagens para o computador e as remove do servidor.'),
    o('C', 'IMAP.', 'Correta: sincroniza e mantém as mensagens no servidor.'),
    o('D', 'DNS.', 'Errada: traduz nomes de domínio em endereços IP.'),
    o('E', 'DHCP.', 'Errada: distribui endereços IP em uma rede.')], 'C', 'Médio'),
]
const mlc = mkC('mail', 'info-4', 'info-email')
export const MAIL_CARDS: Flashcard[] = [
  mlc(1, 'O que faz o campo Cco?', 'Envia cópia oculta: os demais destinatários não veem esses endereços.'),
  mlc(2, 'Qual protocolo envia e-mails?', 'SMTP.'),
  mlc(3, 'POP3 x IMAP?', 'POP3 baixa as mensagens (em geral removendo do servidor); IMAP sincroniza e mantém no servidor.'),
  mlc(4, 'Responder x Responder a todos?', 'Responder vai só ao remetente; Responder a todos inclui remetente, Para e Cc.'),
  mlc(5, 'O que é phishing?', 'Mensagem fraudulenta para obter dados ou instalar malware.'),
  mlc(6, 'Quais são as pastas padrão de e-mail?', 'Caixa de Entrada, Enviados, Rascunhos, Excluídos e Lixo Eletrônico.'),
]

// ───────── info-5
export const NET_LESSON: Lesson = {
  id: 'info-internet', topicId: 'info-5', title: 'Internet: navegação, protocolos e segurança', questionIds: ['net-1', 'net-2', 'net-3', 'net-4', 'net-5'],
  steps: [
    step('Entenda', ['A Internet é a rede mundial de computadores; a Web (WWW) é um dos serviços que funcionam nela. Intranet é rede interna de uma organização; Extranet é a intranet aberta a parceiros autorizados. Navegadores: Edge, Chrome, Firefox etc.',
      'Conceitos: URL é o endereço de um recurso (https://www.exemplo.com.br/pagina); HTTP transfere páginas; HTTPS é a versão com criptografia (cadeado no navegador); DNS traduz nomes de domínio em endereços IP; IP identifica o dispositivo na rede. Cookies são pequenos arquivos que o site grava no navegador (preferências, sessão); cache guarda cópias de conteúdo para carregar mais rápido; histórico lista as páginas visitadas.',
      'Navegação anônima (Chrome) / InPrivate (Edge): não guarda histórico, cookies e dados de formulário NO DISPOSITIVO após fechar, mas NÃO esconde a navegação do provedor de internet, do empregador ou dos sites. Atalhos: Ctrl + T (nova aba), Ctrl + Shift + T (reabrir aba fechada), Ctrl + Shift + N (janela anônima/InPrivate no Chrome e Edge), Ctrl + D (favorito), Ctrl + H (histórico), Ctrl + J (downloads), Ctrl + Shift + Del (limpar dados de navegação), F5 (recarregar).'],
      'HTTPS protege o CAMINHO entre você e o site (a conversa é criptografada), mas não garante que o site seja confiável: um site fraudulento também pode usar HTTPS.'),
    step('Exemplo prático', ['Caso 1: fechou uma aba sem querer → Ctrl + Shift + T reabre.',
      'Caso 2: digitar www.exemplo.com.br e o navegador achar o servidor → o DNS converteu o nome em IP.',
      'Caso 3: um site de compras com cadeado e https:// → a conexão é criptografada.',
      'Caso 4: navegar em janela anônima em computador do trabalho → o histórico não fica no navegador, mas a rede da empresa pode registrar o acesso.',
      'Caso 5: limpar dados de navegação para apagar histórico e cookies → Ctrl + Shift + Del.'],
      'Questões de segurança costumam trocar "protege no dispositivo" por "oculta de todos": desconfie de respostas absolutas.'),
    step('Resumo essencial', ['Termos e atalhos.'], undefined, { caption: 'Internet', head: ['Termo', 'Significado', 'Observação'], rows: [
      ['HTTP / HTTPS', 'Protocolo de páginas / versão criptografada', 'Cadeado'],
      ['DNS', 'Nome de domínio → endereço IP', ''],
      ['Cookie', 'Pequeno arquivo gravado pelo site', 'Preferências, sessão'],
      ['Cache', 'Cópia local para acelerar o carregamento', ''],
      ['Aba anônima / InPrivate', 'Não guarda histórico no dispositivo', 'Não oculta do provedor'],
      ['Ctrl + Shift + T', 'Reabrir aba fechada', '']] }),
    step('O que memorizar', ['• HTTPS = HTTP + criptografia.',
      '• DNS traduz nomes em IPs.',
      '• Anônima não é anonimato: provedor, empresa e sites ainda veem.',
      '• Ctrl + Shift + T reabre a última aba fechada.',
      '• Intranet é interna; extranet permite parceiros.'] ),
  ],
}
const nq = mkQ('net', 'info-5')
export const NET_QUESTIONS: Question[] = [
  nq(1, 'O protocolo que transfere páginas da web de forma criptografada, indicado pelo cadeado no navegador, é o', [
    o('A', 'HTTP.', 'Errada: transfere páginas sem criptografia.'),
    o('B', 'FTP.', 'Errada: é voltado à transferência de arquivos.'),
    o('C', 'SMTP.', 'Errada: é usado para envio de e-mails.'),
    o('D', 'HTTPS.', 'Correta: é a versão segura do HTTP.'),
    o('E', 'DNS.', 'Errada: traduz nomes em endereços IP.')], 'D', 'Fácil'),
  nq(2, 'Na Internet, o serviço responsável por converter nomes de domínio, como www.exemplo.com.br, em endereços IP é o', [
    o('A', 'DNS.', 'Correta: Domain Name System.'),
    o('B', 'DHCP.', 'Errada: distribui endereços IP automaticamente na rede.'),
    o('C', 'POP3.', 'Errada: é protocolo de recebimento de e-mail.'),
    o('D', 'URL.', 'Errada: é o endereço do recurso, e não o serviço de tradução.'),
    o('E', 'Cache.', 'Errada: guarda cópias locais de conteúdo.')], 'A', 'Fácil'),
  nq(3, 'Os pequenos arquivos que os sites gravam no navegador do usuário, guardando preferências ou informações de sessão, são os', [
    o('A', 'firewalls.', 'Errada: são barreiras de proteção de rede.'),
    o('B', 'cookies.', 'Correta: arquivos gravados pelo site no navegador.'),
    o('C', 'proxies.', 'Errada: são intermediários de conexão.'),
    o('D', 'plug-ins de vídeo.', 'Errada: são extensões para reproduzir conteúdo.'),
    o('E', 'endereços IP.', 'Errada: identificam dispositivos na rede.')], 'B', 'Fácil'),
  nq(4, 'Sobre a navegação em janela anônima (Chrome) ou InPrivate (Edge), é correto afirmar que', [
    o('A', 'oculta completamente a atividade do usuário do provedor de internet.', 'Errada: o provedor ainda vê o tráfego.'),
    o('B', 'impede que sites identifiquem o endereço IP do usuário.', 'Errada: o IP continua visível para os sites.'),
    o('C', 'não guarda histórico e cookies no dispositivo após o fechamento da janela.', 'Correta: o efeito é local, no dispositivo.'),
    o('D', 'torna a conexão criptografada.', 'Errada: a criptografia depende de HTTPS, e não do modo anônimo.'),
    o('E', 'bloqueia automaticamente todo malware.', 'Errada: não substitui antivírus nem boas práticas.')], 'C', 'Médio'),
  nq(5, 'Nos navegadores Chrome e Edge, o atalho que reabre a última aba fechada é', [
    o('A', 'Ctrl + T.', 'Errada: abre uma nova aba em branco.'),
    o('B', 'Ctrl + Shift + T.', 'Correta: reabre a última aba fechada.'),
    o('C', 'Ctrl + H.', 'Errada: abre o histórico.'),
    o('D', 'Ctrl + J.', 'Errada: abre a lista de downloads.'),
    o('E', 'Ctrl + D.', 'Errada: adiciona a página aos favoritos.')], 'B', 'Médio'),
]
const nc = mkC('net', 'info-5', 'info-internet')
export const NET_CARDS: Flashcard[] = [
  nc(1, 'Diferença entre HTTP e HTTPS?', 'HTTPS é o HTTP com criptografia (cadeado).'),
  nc(2, 'Para que serve o DNS?', 'Traduz nomes de domínio em endereços IP.'),
  nc(3, 'O que são cookies?', 'Pequenos arquivos gravados pelo site no navegador (preferências, sessão).'),
  nc(4, 'A janela anônima torna o usuário invisível?', 'Não: só evita guardar histórico e cookies no dispositivo; provedor, empresa e sites ainda veem.'),
  nc(5, 'Atalho para reabrir a aba fechada?', 'Ctrl + Shift + T.'),
  nc(6, 'Intranet x extranet?', 'Intranet é a rede interna; extranet a abre a parceiros autorizados.'),
]

// ───────── info-6
export const TEAMS_LESSON: Lesson = {
  id: 'info-teams', topicId: 'info-6', title: 'MS Teams: equipes, canais, chats e reuniões', questionIds: ['teams-1', 'teams-2', 'teams-3', 'teams-4', 'teams-5'],
  steps: [
    step('Entenda', ['O Microsoft Teams é a plataforma de colaboração do Microsoft 365: reúne chat, chamadas, reuniões por vídeo, arquivos e aplicativos. A organização é por EQUIPES (grupos de pessoas), que se dividem em CANAIS (tópicos dentro da equipe); canais podem ser padrão, privados ou compartilhados. Conversas diretas (1:1 ou em grupo) ficam em Chat.',
      'Recursos: @menção para chamar a atenção de uma pessoa, equipe ou canal; compartilhar tela e arquivos em reuniões; gravar reuniões; levantar a mão; fundo desfocado; quadro branco; status de presença (Disponível, Ocupado, Não incomodar, Ausente). A aba Calendário integra os eventos do Outlook.',
      'Armazenamento: os arquivos postados em um CANAL ficam em uma biblioteca do SharePoint da equipe; os arquivos compartilhados em um CHAT ficam no OneDrive de quem os enviou. Por isso a permissão de acesso depende de onde o arquivo está.'],
      'Equipe é a "sala da casa"; canal é o "assunto da roda de conversa" dentro dela; chat é a conversa particular.'),
    step('Exemplo prático', ['Caso 1: chamar uma colega específica em uma conversa de canal → @Nome.',
      'Caso 2: apresentar uma planilha durante a reunião → Compartilhar tela.',
      'Caso 3: um arquivo enviado em um canal da equipe → fica na biblioteca de documentos do SharePoint da equipe.',
      'Caso 4: um arquivo enviado em chat 1:1 → fica no OneDrive de quem enviou, com permissão concedida ao destinatário.',
      'Caso 5: revisar reunião de que você não participou → usar a gravação, se tiver sido feita.'],
      'Lembre a regra: canal → SharePoint; chat → OneDrive.'),
    step('Resumo essencial', ['Estrutura e armazenamento.'], undefined, { caption: 'Teams', head: ['Elemento', 'Função', 'Arquivos ficam em'], rows: [
      ['Equipe', 'Grupo de pessoas', 'SharePoint'],
      ['Canal', 'Tópico da equipe', 'SharePoint (biblioteca da equipe)'],
      ['Chat', 'Conversa direta ou em grupo', 'OneDrive de quem enviou'],
      ['Reunião', 'Vídeo, áudio, tela, gravação', 'Gravação em OneDrive/SharePoint'],
      ['@menção', 'Notifica pessoa, equipe ou canal', '']] }),
    step('O que memorizar', ['• Equipes têm canais.',
      '• @menção notifica.',
      '• Arquivos de canal → SharePoint; arquivos de chat → OneDrive.',
      '• Reunião permite compartilhar tela e gravar.',
      '• Presença: Disponível, Ocupado, Não incomodar, Ausente.'] ),
  ],
}
const tq = mkQ('teams', 'info-6')
export const TEAMS_QUESTIONS: Question[] = [
  tq(1, 'No MS Teams, os arquivos publicados em um canal de uma equipe são armazenados, em regra, em', [
    o('A', 'uma biblioteca do SharePoint da equipe.', 'Correta: o armazenamento de canais usa o SharePoint.'),
    o('B', 'um pen drive do usuário.', 'Errada: o Teams não grava no pen drive.'),
    o('C', 'uma pasta local, do computador de cada membro.', 'Errada: o armazenamento é em nuvem.'),
    o('D', 'um servidor de e-mail.', 'Errada: e-mail e arquivos de equipe são serviços distintos.'),
    o('E', 'uma lixeira do Windows.', 'Errada: a Lixeira não é um armazenamento de arquivos do Teams.')], 'A', 'Médio'),
  tq(2, 'No MS Teams, para chamar a atenção de uma pessoa específica em uma conversa de canal, o usuário digita', [
    o('A', '#nome.', 'Errada: não é o recurso de menção.'),
    o('B', '$nome.', 'Errada: não é o recurso de menção.'),
    o('C', '@nome.', 'Correta: a @menção notifica a pessoa.'),
    o('D', '&nome.', 'Errada: não é o recurso de menção.'),
    o('E', '%nome.', 'Errada: não é o recurso de menção.')], 'C', 'Fácil'),
  tq(3, 'Durante uma reunião no MS Teams, o recurso que permite exibir aos participantes o conteúdo da tela do usuário é', [
    o('A', 'levantar a mão.', 'Errada: sinaliza que o participante quer falar.'),
    o('B', 'compartilhar tela.', 'Correta: exibe tela ou janela aos participantes.'),
    o('C', 'desfocar fundo.', 'Errada: apenas altera o plano de fundo do vídeo.'),
    o('D', 'não incomodar.', 'Errada: é um status de presença.'),
    o('E', 'bloquear o chat.', 'Errada: não exibe a tela.')], 'B', 'Fácil'),
  tq(4, 'Na estrutura do MS Teams, os canais são', [
    o('A', 'divisões de uma equipe, organizadas por assunto.', 'Correta: cada equipe tem um ou mais canais.'),
    o('B', 'conversas individuais entre dois usuários.', 'Errada: as conversas individuais ficam em Chat.'),
    o('C', 'grupos acima das equipes.', 'Errada: os canais estão dentro das equipes.'),
    o('D', 'listas de contatos telefônicos externos.', 'Errada: não são listas de contatos.'),
    o('E', 'configurações de segurança da conta.', 'Errada: não se relacionam à segurança da conta.')], 'A', 'Fácil'),
  tq(5, 'Um arquivo enviado por um usuário em uma conversa de chat 1:1 no MS Teams fica armazenado, em regra, no', [
    o('A', 'SharePoint da equipe.', 'Errada: é o local dos arquivos de canais.'),
    o('B', 'OneDrive de quem o enviou.', 'Correta: o destinatário recebe permissão de acesso.'),
    o('C', 'disco local do destinatário.', 'Errada: só ocorre se o destinatário baixar o arquivo.'),
    o('D', 'Lixeira do Teams.', 'Errada: não existe esse local de armazenamento.'),
    o('E', 'servidor de e-mail.', 'Errada: o arquivo não é anexo de e-mail.')], 'B', 'Médio'),
]
const tc = mkC('teams', 'info-6', 'info-teams')
export const TEAMS_CARDS: Flashcard[] = [
  tc(1, 'Como é organizado o Teams?', 'Equipes, divididas em canais; conversas diretas ficam em Chat.'),
  tc(2, 'Onde ficam os arquivos de um canal?', 'Em uma biblioteca do SharePoint da equipe.'),
  tc(3, 'Onde ficam os arquivos de um chat?', 'No OneDrive de quem os enviou.'),
  tc(4, 'Como chamar uma pessoa em uma conversa?', 'Com @menção (@nome).'),
  tc(5, 'O que faz Compartilhar tela?', 'Exibe a tela ou janela do usuário aos participantes da reunião.'),
  tc(6, 'Quais são os status de presença?', 'Disponível, Ocupado, Não incomodar, Ausente (entre outros).'),
]

// ───────── info-7
export const OD_LESSON: Lesson = {
  id: 'info-onedrive', topicId: 'info-7', title: 'OneDrive: nuvem, sincronização e compartilhamento', questionIds: ['od-1', 'od-2', 'od-3', 'od-4', 'od-5'],
  steps: [
    step('Entenda', ['O OneDrive é o serviço de armazenamento em nuvem da Microsoft. Os arquivos ficam em servidores e podem ser acessados de qualquer dispositivo com conta e internet; o aplicativo sincroniza uma pasta do computador com a nuvem. É integrado ao Windows, ao Office (salvar direto na nuvem) e ao Teams.',
      'Arquivos Sob Demanda: o arquivo aparece no Explorador, mas pode estar SOMENTE ONLINE (ícone de nuvem, ocupa pouco espaço local e exige internet para abrir), DISPONÍVEL LOCALMENTE (baixado ao abrir) ou SEMPRE MANTIDO NESTE DISPOSITIVO (baixado e fixo).',
      'Compartilhamento: gerar link ou convidar pessoas, escolhendo a permissão (pode editar ou somente exibição). Histórico de versões permite restaurar uma versão anterior de um arquivo. Arquivos excluídos vão para a Lixeira do OneDrive e podem ser restaurados por um período. Há também o Cofre Pessoal, área protegida por verificação de identidade adicional, e o backup de pastas (Área de Trabalho, Documentos e Imagens).'],
      'A nuvem é um "cofre-espelho": o que muda de um lado aparece do outro; por isso, apagar na pasta sincronizada apaga na nuvem também (pode ser recuperado pela Lixeira do OneDrive).'),
    step('Exemplo prático', ['Caso 1: enviar um documento a um colega sem anexo de e-mail → compartilhar um link.',
      'Caso 2: dar acesso somente para leitura → definir a permissão como somente exibição.',
      'Caso 3: o computador tem pouco espaço → deixar arquivos "somente online" (ícone de nuvem).',
      'Caso 4: salvou por cima de um arquivo importante → Histórico de versões e restaurar.',
      'Caso 5: apagou um arquivo por engano → procurar na Lixeira do OneDrive.'],
      'Distinga: Lixeira do Windows (arquivos do disco local) e Lixeira do OneDrive (arquivos excluídos na nuvem).'),
    step('Resumo essencial', ['Recursos do OneDrive.'], undefined, { caption: 'OneDrive', head: ['Recurso', 'O que faz', 'Exemplo'], rows: [
      ['Sincronização', 'Mantém a pasta local e a nuvem iguais', 'Edita em um, aparece no outro'],
      ['Arquivos Sob Demanda', 'Controla o que fica baixado', 'Somente online / local / sempre manter'],
      ['Compartilhar', 'Link ou convite com permissão', 'Exibir / editar'],
      ['Histórico de versões', 'Restaura versão anterior', 'Desfaz sobrescrita'],
      ['Lixeira do OneDrive', 'Recupera arquivos excluídos', ''],
      ['Cofre Pessoal', 'Área com verificação extra', '']] }),
    step('O que memorizar', ['• OneDrive = nuvem Microsoft com sincronização.',
      '• Somente online: ocupa pouco espaço local.',
      '• Compartilhar: escolher permissão (exibir ou editar).',
      '• Versão anterior: Histórico de versões.',
      '• Exclusão acidental: Lixeira do OneDrive.'] ),
  ],
}
const oq = mkQ('od', 'info-7')
export const OD_QUESTIONS: Question[] = [
  oq(1, 'O OneDrive, da Microsoft, é um serviço de', [
    o('A', 'armazenamento de arquivos em nuvem, com sincronização.', 'Correta: guarda arquivos online e sincroniza com os dispositivos.'),
    o('B', 'correio eletrônico.', 'Errada: o e-mail da Microsoft é o Outlook.'),
    o('C', 'planilha eletrônica.', 'Errada: a planilha é o Excel.'),
    o('D', 'navegação na web.', 'Errada: o navegador da Microsoft é o Edge.'),
    o('E', 'videoconferência.', 'Errada: a videoconferência é feita no Teams.')], 'A', 'Fácil'),
  oq(2, 'No OneDrive, um arquivo marcado como "somente online" (ícone de nuvem)', [
    o('A', 'ocupa o mesmo espaço local que o arquivo baixado.', 'Errada: ocupa pouco espaço local, pois fica na nuvem.'),
    o('B', 'só pode ser aberto por quem o criou.', 'Errada: o acesso depende de permissões, e não do estado de sincronização.'),
    o('C', 'foi excluído da nuvem.', 'Errada: continua guardado na nuvem.'),
    o('D', 'fica armazenado na nuvem e ocupa pouco espaço local, exigindo internet para ser aberto.', 'Correta: é baixado ao ser aberto.'),
    o('E', 'não pode ser compartilhado.', 'Errada: pode ser compartilhado normalmente.')], 'D', 'Médio'),
  oq(3, 'Para que um colega possa apenas ler um arquivo do OneDrive, sem alterá-lo, o usuário deve compartilhar o link com a permissão de', [
    o('A', 'edição.', 'Errada: permite alterar o arquivo.'),
    o('B', 'propriedade.', 'Errada: não é a permissão de leitura.'),
    o('C', 'exibição.', 'Correta: permite abrir e ler, sem editar.'),
    o('D', 'exclusão.', 'Errada: não é uma permissão de compartilhamento comum de leitura.'),
    o('E', 'sincronização.', 'Errada: refere-se ao envio de dados à nuvem, e não à permissão do link.')], 'C', 'Fácil'),
  oq(4, 'Para recuperar uma versão anterior de um documento sobrescrito no OneDrive, o usuário deve utilizar', [
    o('A', 'a Lixeira do Windows.', 'Errada: guarda arquivos excluídos do disco local.'),
    o('B', 'o Histórico de versões.', 'Correta: permite abrir ou restaurar versões anteriores.'),
    o('C', 'o Gerenciador de Tarefas.', 'Errada: gerencia processos em execução.'),
    o('D', 'o Prompt de comando.', 'Errada: não é o recurso de versionamento.'),
    o('E', 'o Cofre Pessoal.', 'Errada: é uma área protegida, e não um recurso de versões.')], 'B', 'Médio'),
  oq(5, 'Um arquivo foi excluído por engano de uma pasta do OneDrive. A primeira providência para tentar recuperá-lo é verificar', [
    o('A', 'a Lixeira do OneDrive.', 'Correta: arquivos excluídos na nuvem ficam ali por um período.'),
    o('B', 'o Painel de Controle.', 'Errada: não guarda arquivos excluídos.'),
    o('C', 'o histórico do navegador.', 'Errada: guarda páginas visitadas, e não arquivos.'),
    o('D', 'o cache do navegador.', 'Errada: guarda cópias temporárias de páginas.'),
    o('E', 'a pasta Downloads.', 'Errada: não relacionada à exclusão no OneDrive.')], 'A', 'Fácil'),
]
const odc = mkC('od', 'info-7', 'info-onedrive')
export const OD_CARDS: Flashcard[] = [
  odc(1, 'O que é o OneDrive?', 'Serviço de armazenamento em nuvem da Microsoft, com sincronização.'),
  odc(2, 'O que significa "somente online"?', 'O arquivo fica na nuvem, ocupa pouco espaço local e exige internet para abrir.'),
  odc(3, 'Como dar acesso só de leitura?', 'Compartilhar o link com a permissão de exibição.'),
  odc(4, 'Como restaurar uma versão anterior?', 'Pelo Histórico de versões.'),
  odc(5, 'Onde procurar um arquivo excluído?', 'Na Lixeira do OneDrive.'),
  odc(6, 'O que é o Cofre Pessoal?', 'Área do OneDrive protegida por verificação de identidade adicional.'),
]

export const INFO_LESSONS = [WIN_LESSON, WORD_LESSON, XL_LESSON, MAIL_LESSON, NET_LESSON, TEAMS_LESSON, OD_LESSON]
export const INFO_QUESTIONS = spread([...WIN_QUESTIONS, ...WORD_QUESTIONS, ...XL_QUESTIONS, ...MAIL_QUESTIONS, ...NET_QUESTIONS, ...TEAMS_QUESTIONS, ...OD_QUESTIONS], 4)
export const INFO_CARDS = [...WIN_CARDS, ...WORD_CARDS, ...XL_CARDS, ...MAIL_CARDS, ...NET_CARDS, ...TEAMS_CARDS, ...OD_CARDS]
