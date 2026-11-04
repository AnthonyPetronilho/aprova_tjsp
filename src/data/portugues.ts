import type { Flashcard, Lesson, Question } from '../types'
import { o, mkQ, mkC, place } from './helpers'
// Aulas inéditas de Língua Portuguesa (Anexo VIII): concordância verbal e nominal (pt-9), regência verbal e nominal (pt-10),
// colocação pronominal (pt-11) e pontuação (pt-13). Seguem a norma-padrão escrita; casos em que as gramáticas divergem foram evitados.
const rot = (qs: Question[], targets: Question['answer'][]) => qs.map((q, i) => place(q, targets[i]))

// ───────────── Concordância verbal e nominal
export const CONC_LESSON: Lesson = {
  id: 'pt-concordancia', topicId: 'pt-9', title: 'Concordância verbal e nominal', questionIds: ['conc-1', 'conc-2', 'conc-3', 'conc-4', 'conc-5'],
  steps: [
    { title: 'Entenda',
      body: ['Concordância é a "combinação" entre as palavras. Na concordância VERBAL, o verbo se ajusta ao sujeito em número (singular/plural) e pessoa. Na concordância NOMINAL, artigo, adjetivo, pronome e numeral se ajustam ao substantivo em gênero e número.',
        'O truque nº 1 é achar o sujeito: pergunte "quem pratica a ação?" ao verbo. O sujeito pode vir depois do verbo ("Chegaram os documentos") e isso confunde muita gente. Se o sujeito é plural, o verbo vai para o plural, esteja onde estiver.',
        'Há verbos que NÃO têm sujeito (impessoais) e por isso ficam no singular: haver no sentido de existir ("Há dúvidas"; "Havia muitos processos") e haver/fazer indicando tempo decorrido ("Há dez anos"; "Faz dois meses"). Erro clássico: "Haviam muitos processos" e "Fazem dois anos".'],
      alt: 'Pense em "Há muitos processos": quem existe? Os processos. Mas "há" aqui significa "existe", e "existir" não tem um sujeito que pratica ação. Por isso o verbo não "obedece" ao plural: continua no singular, como se estivesse sozinho.' },
    { title: 'Exemplo prático',
      body: ['Caso 1 — "se" apassivador: "Vendem-se casas" = "Casas são vendidas". O sujeito é "casas" e o verbo concorda com ele: vendem-se. Erro comum: "Vende-se casas".',
        'Caso 2 — "se" como índice de indeterminação: com verbo que pede preposição (VTI), o verbo fica no singular, sem sujeito: "Precisa-se de escreventes"; "Trata-se de casos urgentes"; "Obedece-se às regras". Erro comum: "Precisam-se de escreventes", "Tratam-se de casos".',
        'Caso 3 — sujeito composto anteposto (antes do verbo): o verbo vai para o plural. "O prazo e a multa venceram." Se há pessoas diferentes, a 1ª pessoa prevalece sobre a 2ª e a 3ª, e a 2ª sobre a 3ª: "Ela e eu fomos ao fórum" (= nós).',
        'Caso 4 — concordância nominal: "anexo", "obrigado", "proibido" e "incluso" concordam com o substantivo ("Seguem anexas as certidões"; "Muito obrigada", dita por uma mulher; "É proibida a entrada"). Mas "meio" (= um pouco), "bastante" (= muito, advérbio) e "menos" não variam: "Ela está meio cansada"; "Eles estão bastante cansados"; "menos pessoas". A expressão "em anexo" é fixa e invariável.'],
      alt: 'Como saber se "meio" varia? Troque por "um pouco": "Ela estava um pouco cansada". Se a troca funciona, é advérbio e não varia. Se significa "metade" (meia hora), é numeral e varia.' },
    { title: 'Resumo essencial',
      body: ['Os casos abaixo concentram a maioria das questões de concordância.'],
      table: { caption: 'Concordância: caso a caso', head: ['Situação', 'Regra', 'Exemplo correto'], rows: [
        ['Haver = existir; haver/fazer = tempo', 'Verbo no singular (impessoal)', 'Havia muitos processos. Faz dois anos.'],
        ['Se apassivador (VTD + se)', 'Verbo concorda com o sujeito', 'Alugam-se salas.'],
        ['Se índice de indeterminação (VTI/VI + se)', 'Verbo no singular', 'Precisa-se de escreventes.'],
        ['Sujeito composto antes do verbo', 'Plural', 'O prazo e a multa venceram.'],
        ['Pessoas diferentes no sujeito composto', '1ª pessoa prevalece', 'Ela e eu fomos.'],
        ['Anexo, obrigado, proibido', 'Concordam com o substantivo', 'Seguem anexas as certidões.'],
        ['Meio (= um pouco), bastante (adv.), menos', 'Invariáveis', 'Ela está meio cansada.']] } },
    { title: 'O que memorizar',
      body: ['• Primeiro ache o sujeito (pergunte "quem?" ao verbo) — mesmo que ele esteja depois do verbo.',
        '• Haver (existir) e haver/fazer (tempo decorrido): sempre singular. "Deve haver" (e não "devem haver").',
        '• "Se" + verbo transitivo direto: concorda com o sujeito ("Vendem-se casas"). "Se" + verbo com preposição: singular ("Precisa-se de…", "Trata-se de…").',
        '• Sujeito composto antes do verbo: plural; 1ª pessoa vence a 2ª e a 3ª.',
        '• Anexo, obrigado, proibido, incluso: concordam. "Em anexo": invariável.',
        '• Meio (um pouco), bastante (advérbio) e menos: não variam.'] },
  ],
}
const cq = mkQ('conc', 'pt-9')
export const CONC_QUESTIONS: Question[] = rot([
  cq(1, 'Assinale a alternativa em que o verbo está empregado de acordo com a norma-padrão.', [
    o('A', 'Haviam muitos candidatos na sala.', 'Errada: "haver" no sentido de existir é impessoal e fica no singular ("Havia muitos candidatos").'),
    o('B', 'Fazem cinco anos que ele é servidor.', 'Errada: "fazer" indicando tempo decorrido é impessoal; o correto é "Faz cinco anos".'),
    o('C', 'Devem haver provas de todas as disciplinas.', 'Errada: o verbo auxiliar acompanha o impessoal "haver" e fica no singular ("Deve haver").'),
    o('D', 'Há muitos anos o tribunal funciona nesse prédio.', 'Correta: "há" indicando tempo decorrido é impessoal e fica no singular.'),
    o('E', 'Houveram dois recursos na semana passada.', 'Errada: "haver" no sentido de ocorrer também é impessoal; o correto é "Houve dois recursos".')], 'D', 'Médio'),
  cq(2, 'Assinale a alternativa em que a concordância verbal está correta.', [
    o('A', 'Precisam-se de escreventes para o plantão.', 'Errada: "precisar" pede a preposição "de"; com o "se" indeterminador, o verbo fica no singular ("Precisa-se de escreventes").'),
    o('B', 'Aluga-se salas comerciais no centro.', 'Errada: aqui o "se" é apassivador ("salas comerciais são alugadas"); o verbo concorda: "Alugam-se salas comerciais".'),
    o('C', 'Tratam-se de casos urgentes.', 'Errada: "tratar de" pede preposição; o verbo fica no singular ("Trata-se de casos urgentes").'),
    o('D', 'Alugam-se salas comerciais no centro.', 'Correta: "salas comerciais" é o sujeito (voz passiva sintética) e o verbo concorda com ele.'),
    o('E', 'Existe diversos pedidos pendentes.', 'Errada: "existir" é pessoal e concorda com o sujeito plural: "Existem diversos pedidos pendentes".')], 'D', 'Médio'),
  cq(3, 'Assinale a alternativa que preenche corretamente as lacunas: "Seguem ___ as certidões solicitadas. A servidora estava ___ cansada."', [
    o('A', 'anexo – meio', 'Errada: "anexo" é adjetivo e deve concordar com "certidões" (anexas). A forma invariável é a expressão "em anexo".'),
    o('B', 'anexas – meia', 'Errada: "meio" com o sentido de "um pouco" é advérbio e não varia.'),
    o('C', 'anexas – meio', 'Correta: "anexas" concorda com "certidões"; "meio" (= um pouco) é advérbio invariável.'),
    o('D', 'anexo – meia', 'Errada: erra nas duas lacunas.'),
    o('E', 'anexos – meio', 'Errada: "certidões" é feminino; o adjetivo deve ficar no feminino (anexas).')], 'C', 'Médio'),
  cq(4, 'Assinale a alternativa em que a concordância nominal está de acordo com a norma-padrão.', [
    o('A', 'Os servidores estavam bastantes cansados.', 'Errada: "bastante" modificando um adjetivo é advérbio (= muito) e não varia: "bastante cansados".'),
    o('B', 'É proibida a entrada de pessoas estranhas ao serviço.', 'Correta: com artigo definido ("a entrada"), o adjetivo "proibida" concorda com o substantivo.'),
    o('C', 'Ela estava meia preocupada com o prazo.', 'Errada: "meio" (= um pouco) é advérbio invariável: "meio preocupada".'),
    o('D', 'Foram aplicadas menas multas neste ano.', 'Errada: "menos" é invariável; a forma "menas" não existe na norma-padrão.'),
    o('E', 'Seguem em anexas as certidões solicitadas.', 'Errada: "em anexo" é expressão fixa e invariável; ou se usa "seguem anexas" ou "seguem em anexo".')], 'B', 'Médio'),
  cq(5, 'Assinale a alternativa em que a concordância verbal está correta.', [
    o('A', 'O prazo e a multa vence hoje.', 'Errada: sujeito composto antes do verbo exige o plural: "vencem".'),
    o('B', 'Os documentos e a certidão foi entregue.', 'Errada: sujeito composto, plural: "foram entregues".'),
    o('C', 'Ela e eu fomos ao fórum.', 'Correta: "ela e eu" equivale a "nós"; a 1ª pessoa prevalece sobre a 3ª.'),
    o('D', 'Ele e eu foi ao fórum.', 'Errada: "ele e eu" = nós; o verbo deve ir para o plural (fomos).'),
    o('E', 'Tu e ele vai à audiência.', 'Errada: sujeito composto exige o plural: "vão" (ou "ireis", na 2ª pessoa do plural).')], 'C', 'Médio'),
], ['B', 'E', 'C', 'A', 'D'])
const cc = mkC('conc', 'pt-9', 'pt-concordancia')
export const CONC_CARDS: Flashcard[] = [
  cc(1, 'Como achar o sujeito para decidir a concordância do verbo?', 'Pergunte "quem?" ao verbo. O sujeito pode vir depois do verbo ("Chegaram os documentos").'),
  cc(2, 'O verbo "haver" no sentido de "existir" varia? E "fazer" indicando tempo?', 'Não. São impessoais e ficam no singular: "Havia dúvidas", "Faz dois anos", "Deve haver provas".'),
  cc(3, 'Qual a diferença entre "Vendem-se casas" e "Precisa-se de escreventes"?', 'No primeiro, o "se" é apassivador e o verbo concorda com o sujeito (casas). No segundo, o verbo pede preposição e fica no singular (sem sujeito).'),
  cc(4, 'Como fica o verbo com sujeito composto antes do verbo com pessoas diferentes?', 'Vai para o plural, e a 1ª pessoa prevalece sobre a 2ª e a 3ª. "Ela e eu fomos."'),
  cc(5, 'Quais palavras concordam: anexo, obrigado, proibido? E quais não variam?', 'Anexo, obrigado, proibido, incluso concordam com o substantivo. "Em anexo", "meio" (= um pouco), "bastante" (advérbio) e "menos" não variam.'),
  cc(6, 'Como saber se "meio" varia?', 'Troque por "um pouco": se funcionar, é advérbio e não varia ("meio cansada"). Como numeral (= metade), varia ("meia hora").'),
]

// ───────────── Regência verbal e nominal
export const REG_LESSON: Lesson = {
  id: 'pt-regencia', topicId: 'pt-10', title: 'Regência verbal e nominal', questionIds: ['reg-1', 'reg-2', 'reg-3', 'reg-4', 'reg-5'],
  steps: [
    { title: 'Entenda',
      body: ['Regência é a relação de dependência entre um termo e seu complemento — e quase sempre envolve uma PREPOSIÇÃO. Na regência VERBAL, o verbo pede (ou não) preposição ("obedecer A algo", "visitar algo"). Na regência NOMINAL, substantivos, adjetivos e advérbios pedem preposição ("preferência POR", "capaz DE", "contrário A").',
        'O verbo que pede complemento sem preposição é transitivo direto (VTD); o que pede com preposição é transitivo indireto (VTI). O mesmo verbo pode mudar de regência quando muda de sentido: "assistir ao filme" (ver) é VTI; "assistir o doente" (ajudar) pode ser VTD.',
        'Vale uma regra prática para relativos: a preposição exigida pelo verbo vem ANTES do pronome relativo. "O processo a que me referi" (referir-se A algo); "O cargo a que aspiro" (aspirar A algo).'],
      alt: 'Imagine que cada verbo tem uma "tomada" própria. "Obedecer" tem tomada com o pino "a": obedecer A alguém. "Visitar" não tem pino nenhum: visitar alguém. Errar a regência é ligar o plugue na tomada errada.' },
    { title: 'Exemplo prático',
      body: ['Caso 1 — assistir (ver, presenciar): VTI, exige "a". "Assistimos ao julgamento." Com relativo: "O julgamento a que assistimos foi longo." Erro comum: "O julgamento que assistimos".',
        'Caso 2 — obedecer e desobedecer: VTI, exigem "a". "Obedeça às normas do tribunal." Erro comum: "obedecer as normas".',
        'Caso 3 — preferir: pede "a" e dispensa "mais" e "do que". "Prefiro estudar a trabalhar." Erro comum: "Prefiro mais estudar do que trabalhar".',
        'Caso 4 — aspirar: no sentido de desejar, é VTI ("aspirar a um cargo"); no sentido de respirar, é VTD ("aspirar o ar"). Implicar no sentido de acarretar é VTD: "A decisão implica custos" (sem "em").',
        'Caso 5 — chegar e ir pedem "a" para indicar destino: "Cheguei ao fórum", "Vou ao cartório". (O uso de "em" com "chegar" é comum na fala, mas a norma-padrão escrita pede "a".)',
        'Regência nominal: contrário A, obediência A, resistência A, aversão A, capaz DE, preferência POR, responsável POR, devoção A.'],
      alt: 'Macete do relativo: tire o relativo e refaça a frase com o pronome. "Referi-me ao processo" → "O processo a que me referi". A preposição ("a") sobe junto com o "que".' },
    { title: 'Resumo essencial',
      body: ['Os verbos abaixo concentram a maioria das cobranças em provas.'],
      table: { caption: 'Regências mais cobradas', head: ['Termo', 'Regência', 'Exemplo correto'], rows: [
        ['Assistir (= ver)', 'a', 'Assistimos ao julgamento.'],
        ['Obedecer / desobedecer', 'a', 'Obedeça às normas.'],
        ['Preferir', 'a (sem "mais" e "do que")', 'Prefiro estudar a trabalhar.'],
        ['Aspirar (= desejar)', 'a', 'Aspiro a um cargo público.'],
        ['Implicar (= acarretar)', 'sem preposição', 'A medida implica custos.'],
        ['Chegar / ir (destino)', 'a', 'Cheguei ao fórum.'],
        ['Contrário, obediência, resistência, aversão', 'a', 'Contrário à proposta.'],
        ['Capaz, responsável, preferência', 'de / por / por', 'Capaz de decidir.']] } },
    { title: 'O que memorizar',
      body: ['• Assistir (ver), obedecer, desobedecer, aspirar (desejar): pedem "a".',
        '• Preferir: "prefiro X a Y" — sem "mais" e sem "do que".',
        '• Implicar (acarretar): VTD, sem "em". Aspirar (respirar): VTD.',
        '• Chegar e ir: destino com "a" (norma-padrão escrita).',
        '• Relativo: a preposição do verbo vem antes dele ("o cargo a que aspiro").',
        '• Regência nominal: contrário A, aversão A, resistência A, obediência A; capaz DE; responsável POR; preferência POR.'] },
  ],
}
const rq = mkQ('reg', 'pt-10')
export const REG_QUESTIONS: Question[] = rot([
  rq(1, 'Assinale a alternativa em que a regência verbal está de acordo com a norma-padrão.', [
    o('A', 'O servidor obedeceu as ordens do chefe.', 'Errada: "obedecer" é transitivo indireto e pede "a": "obedeceu às ordens".'),
    o('B', 'Prefiro mais o café do que o chá.', 'Errada: "preferir" pede "a" e dispensa "mais" e "do que": "Prefiro o café ao chá".'),
    o('C', 'Os candidatos aspiram a um cargo público.', 'Correta: "aspirar", no sentido de desejar, pede a preposição "a".'),
    o('D', 'A decisão implica em novos custos.', 'Errada: "implicar", no sentido de acarretar, é transitivo direto: "implica novos custos".'),
    o('E', 'O escrevente simpatizou o novo colega.', 'Errada: "simpatizar" pede "com": "simpatizou com o novo colega".')], 'C', 'Médio'),
  rq(2, 'Assinale a alternativa em que a regência do verbo "assistir" (no sentido de ver) está correta.', [
    o('A', 'Assistimos o julgamento até o final.', 'Errada: no sentido de ver, "assistir" pede "a": "assistimos ao julgamento".'),
    o('B', 'Assistimos ao julgamento até o final.', 'Correta: "assistir" (= ver, presenciar) é transitivo indireto e exige a preposição "a".'),
    o('C', 'Os alunos assistiram as aulas remotas.', 'Errada: faltou a preposição "a": "assistiram às aulas".'),
    o('D', 'O filme que assistimos foi ótimo.', 'Errada: a preposição deve vir antes do relativo: "o filme a que assistimos".'),
    o('E', 'Assistiram-lhe o filme inteiro.', 'Errada: o complemento de "assistir" (ver) é a coisa vista, introduzida por "a" ("assistiram ao filme"), e não um pronome "lhe" antes do filme.')], 'B', 'Médio'),
  rq(3, 'Assinale a alternativa em que a regência do verbo "preferir" está de acordo com a norma-padrão.', [
    o('A', 'Prefiro estudar do que trabalhar.', 'Errada: "preferir" não admite "do que"; usa-se "a".'),
    o('B', 'Prefiro mais estudar que trabalhar.', 'Errada: "preferir" já indica comparação; "mais" e "que" são dispensáveis e incorretos aqui.'),
    o('C', 'Prefiro estudar a trabalhar.', 'Correta: "prefiro X a Y".'),
    o('D', 'Prefiro mais estudar do que trabalhar.', 'Errada: combina duas inadequações ("mais" e "do que").'),
    o('E', 'Prefiro estudar do que a trabalhar.', 'Errada: mistura "do que" com "a"; só a preposição "a" é adequada.')], 'C', 'Fácil'),
  rq(4, 'Assinale a alternativa em que a regência nominal está de acordo com a norma-padrão.', [
    o('A', 'Tenho aversão com o trabalho burocrático.', 'Errada: "aversão" pede "a" ou "por": "aversão ao trabalho".'),
    o('B', 'Ela é muito capaz em resolver conflitos.', 'Errada: "capaz" pede "de": "capaz de resolver conflitos".'),
    o('C', 'Sua conduta é contrária ao regulamento.', 'Correta: "contrário/contrária" pede a preposição "a".'),
    o('D', 'Os servidores têm devoção com o tribunal.', 'Errada: "devoção" pede "a" ou "por".'),
    o('E', 'Houve resistência com a reforma do prédio.', 'Errada: "resistência" pede "a": "resistência à reforma".')], 'C', 'Médio'),
  rq(5, 'Assinale a alternativa que completa corretamente a lacuna: "O processo ___ me referi está arquivado."', [
    o('A', 'que', 'Errada: "referir-se" pede "a"; sem a preposição antes do relativo, a frase fica incorreta.'),
    o('B', 'de que', 'Errada: "referir-se" não pede "de".'),
    o('C', 'em que', 'Errada: "referir-se" não pede "em".'),
    o('D', 'a que', 'Correta: "referi-me ao processo" → "o processo a que me referi".'),
    o('E', 'com que', 'Errada: "referir-se" não pede "com".')], 'D', 'Médio'),
], ['C', 'B', 'E', 'A', 'D'])
const rc = mkC('reg', 'pt-10', 'pt-regencia')
export const REG_CARDS: Flashcard[] = [
  rc(1, 'O que é regência?', 'A relação entre um termo (verbo ou nome) e seu complemento, em geral mediada por preposição.'),
  rc(2, 'Qual a regência de "assistir" no sentido de ver? Dê um exemplo.', 'Pede "a": "Assistimos ao julgamento." Com relativo: "O julgamento a que assistimos".'),
  rc(3, 'Qual a regência de "obedecer" e "desobedecer"?', 'Pedem "a": "obedecer às normas".'),
  rc(4, 'Como se usa o verbo "preferir"?', '"Prefiro X a Y", sem "mais" e sem "do que".'),
  rc(5, '"Aspirar" e "implicar": qual a regência de cada um nos sentidos mais cobrados?', 'Aspirar (desejar): "a". Aspirar (respirar): sem preposição. Implicar (acarretar): sem preposição ("implica custos").'),
  rc(6, 'Onde fica a preposição quando há pronome relativo?', 'Antes do relativo: "o cargo a que aspiro", "o processo a que me referi".'),
]

// ───────────── Colocação pronominal
export const COL_LESSON: Lesson = {
  id: 'pt-colocacao', topicId: 'pt-11', title: 'Colocação pronominal', questionIds: ['col-1', 'col-2', 'col-3', 'col-4', 'col-5'],
  steps: [
    { title: 'Entenda',
      body: ['Colocação pronominal trata da posição dos pronomes oblíquos átonos (me, te, se, o, a, lhe, nos, vos, os, as, lhes) em relação ao verbo. Há três posições: PRÓCLISE (antes do verbo: "Não me disseram"), ÊNCLISE (depois, com hífen: "Disseram-me") e MESÓCLISE (no meio do verbo, com hífens: "Dir-me-ão").',
        'A regra de ouro da norma-padrão: o pronome NÃO inicia frase ou oração principal. Por isso, em vez de "Me disseram", escreve-se "Disseram-me". Em frases comuns e sem nenhuma palavra "atraente", a ênclise é o padrão.',
        'Algumas palavras "puxam" o pronome para antes do verbo (próclise obrigatória), chamadas atrativas: palavras negativas (não, nunca, ninguém, nada, jamais), pronomes relativos (que, quem, o qual), pronomes indefinidos (todos, alguém, tudo), conjunções subordinativas (que, se, quando, porque), advérbios sem pausa (aqui, já, sempre, talvez), e orações optativas ("Deus o abençoe").'],
      alt: 'Pense em um ímã. Palavras como "não", "que" e "ninguém" são ímãs: puxam o pronome para perto, antes do verbo. Sem ímã por perto e sem nenhuma palavra antes (frase começando pelo verbo), o pronome vai para depois do verbo, com hífen.' },
    { title: 'Exemplo prático',
      body: ['Caso 1 — próclise com palavra negativa: "Não me entregaram a intimação." Erro comum: "Não entregaram-me".',
        'Caso 2 — próclise com relativo, indefinido e conjunção: "O processo que se arquivou"; "Ninguém o viu sair"; "Todos o viram"; "Quando o encontrei, estava no fórum". Erros comuns: "que arquivou-se", "Todos viram-no".',
        'Caso 3 — ênclise: verbo no início da frase ("Entregue-me o relatório"; "Disseram-me que o prazo acabou"), imperativo afirmativo ("Faça-o", "Comunique-nos") e gerúndio sem "em" ("Saiu cumprimentando-me").',
        'Caso 4 — mesóclise: futuro do presente ou do pretérito, quando o verbo inicia a frase e não há palavra atrativa: "Entregar-te-ei os documentos amanhã"; "Far-se-ia justiça". Com palavra atrativa, volta a próclise: "Não te entregarei".',
        'Caso 5 — locuções verbais e particípio: o pronome pode ficar depois do auxiliar ("Tinha-se esquecido") ou antes dele (se houver atrativo: "Não se tinha esquecido"). Nunca fica depois de particípio: não se diz "tinha esquecido-se".'],
      alt: 'Teste rápido em 3 passos: (1) há palavra atrativa antes do verbo? Se sim, próclise. (2) A frase começa pelo verbo? Então ênclise (ou mesóclise, se futuro). (3) Está depois de particípio? Está errado.' },
    { title: 'Resumo essencial',
      body: ['Um quadro com as três posições e quando cada uma aparece.'],
      table: { caption: 'Próclise, ênclise e mesóclise', head: ['Posição', 'Quando', 'Exemplo'], rows: [
        ['Próclise (antes)', 'Palavra atrativa: negação, relativo, indefinido, conjunção subordinativa, advérbio, optativa', 'Não me disseram. Ninguém o viu.'],
        ['Ênclise (depois)', 'Verbo no início; imperativo afirmativo; infinitivo/gerúndio sem atrativo', 'Disseram-me. Entregue-me.'],
        ['Mesóclise (no meio)', 'Futuro do presente/pretérito iniciando a frase, sem atrativo', 'Entregar-te-ei. Far-se-ia.'],
        ['Nunca', 'Após particípio; iniciando frase (na norma escrita)', '✗ "Tinha esquecido-se"; ✗ "Me disseram"']] } },
    { title: 'O que memorizar',
      body: ['• O pronome oblíquo átono não inicia frase na norma-padrão: "Disseram-me" (e não "Me disseram").',
        '• Atrativos que exigem próclise: não, nunca, ninguém, nada, que, quem, todos, alguém, quando, se (conj.), talvez, advérbios sem pausa, orações optativas.',
        '• Imperativo afirmativo: ênclise ("Entregue-me"). Imperativo negativo: próclise ("Não me entregue").',
        '• Futuro (do presente e do pretérito) iniciando a frase: mesóclise; nunca "Entregarei-te".',
        '• Nunca se coloca o pronome depois de particípio.',
        '• Locução verbal: o pronome fica ao lado do auxiliar (antes ou depois, conforme o atrativo).'] },
  ],
}
const lq = mkQ('col', 'pt-11')
export const COL_QUESTIONS: Question[] = rot([
  lq(1, 'Assinale a alternativa em que a colocação do pronome está de acordo com a norma-padrão.', [
    o('A', 'Não entregaram-lhe a intimação.', 'Errada: a palavra negativa "não" atrai o pronome: "Não lhe entregaram".'),
    o('B', 'Não lhe entregaram a intimação.', 'Correta: o advérbio de negação "não" exige a próclise.'),
    o('C', 'Me entregaram a intimação ontem.', 'Errada: na norma-padrão o pronome oblíquo átono não inicia a frase ("Entregaram-me").'),
    o('D', 'Entregaram a intimação-lhe ontem.', 'Errada: o pronome deve vir colado ao verbo, não ao final da frase.'),
    o('E', 'Lhe entregaram a intimação.', 'Errada: pronome iniciando a frase.')], 'B', 'Fácil'),
  lq(2, 'Assinale a alternativa em que a colocação pronominal está correta.', [
    o('A', 'Entregar-te-ei os documentos amanhã.', 'Correta: futuro do presente iniciando a frase, sem atrativo, pede mesóclise.'),
    o('B', 'Entregarei-te os documentos amanhã.', 'Errada: verbos no futuro do presente não admitem ênclise.'),
    o('C', 'Te entregarei os documentos amanhã.', 'Errada: pronome iniciando a frase (na norma-padrão escrita).'),
    o('D', 'Entregarei os documentos-te amanhã.', 'Errada: pronome fora de posição; deve ficar junto ao verbo.'),
    o('E', 'Entregar te ei os documentos amanhã.', 'Errada: na mesóclise o pronome vem ligado ao verbo por hífens.')], 'A', 'Médio'),
  lq(3, 'Assinale a alternativa em que a colocação do pronome está de acordo com a norma-padrão.', [
    o('A', 'Quando encontrei-o, ele estava no fórum.', 'Errada: a conjunção subordinativa "quando" atrai o pronome: "Quando o encontrei".'),
    o('B', 'Quem disse-me isso foi o escrevente.', 'Errada: o pronome relativo/interrogativo "quem" atrai o pronome: "Quem me disse".'),
    o('C', 'Ninguém o viu sair da sala.', 'Correta: o pronome indefinido "ninguém" exige a próclise.'),
    o('D', 'Todos viram-no sair da sala.', 'Errada: "todos" (pronome indefinido) atrai o pronome: "Todos o viram".'),
    o('E', 'Talvez encontre-se uma solução.', 'Errada: o advérbio "talvez" atrai o pronome: "Talvez se encontre".')], 'C', 'Médio'),
  lq(4, 'Assinale a alternativa que apresenta o imperativo afirmativo com a colocação pronominal de acordo com a norma-padrão.', [
    o('A', 'Me entregue o relatório hoje.', 'Errada: no imperativo afirmativo, a norma-padrão pede a ênclise.'),
    o('B', 'Entregue-me o relatório hoje.', 'Correta: ênclise no imperativo afirmativo.'),
    o('C', 'Entregue o relatório me hoje.', 'Errada: o pronome deve ficar junto ao verbo.'),
    o('D', 'Não entregue-me o relatório hoje.', 'Errada: no imperativo negativo, a palavra "não" atrai o pronome: "Não me entregue".'),
    o('E', 'Entregue me o relatório hoje.', 'Errada: faltou o hífen que liga o pronome ao verbo.')], 'B', 'Fácil'),
  lq(5, 'Assinale a alternativa em que a colocação pronominal NÃO está de acordo com a norma-padrão.', [
    o('A', 'Não se pode negar o direito de defesa.', 'Adequada: a palavra negativa "não" atrai o pronome (próclise).'),
    o('B', 'Disseram-me que o prazo acabou.', 'Adequada: verbo iniciando a frase pede ênclise.'),
    o('C', 'Tinha-se esquecido do prazo final.', 'Adequada: o pronome fica ao lado do auxiliar ("tinha-se"), e não depois do particípio.'),
    o('D', 'Tinha esquecido-se do prazo final.', 'Inadequada: o pronome não pode ficar depois de particípio. Resposta pedida (a que NÃO está de acordo).'),
    o('E', 'Quem o viu não disse nada.', 'Adequada: o pronome "quem" atrai o pronome oblíquo (próclise).')], 'D', 'Médio'),
], ['E', 'C', 'A', 'D', 'B'])
const lc = mkC('col', 'pt-11', 'pt-colocacao')
export const COL_CARDS: Flashcard[] = [
  lc(1, 'O que são próclise, ênclise e mesóclise?', 'Posição do pronome átono: antes do verbo (próclise), depois com hífen (ênclise) e no meio do verbo, no futuro (mesóclise).'),
  lc(2, 'Um pronome oblíquo átono pode iniciar a frase?', 'Na norma-padrão escrita, não. Diz-se "Disseram-me", e não "Me disseram".'),
  lc(3, 'Cite palavras que exigem próclise (atrativas).', 'Negação (não, nunca, ninguém), relativos (que, quem), indefinidos (todos, alguém), conjunções subordinativas (que, quando, se), advérbios sem pausa (talvez, já) e orações optativas.'),
  lc(4, 'Como fica o imperativo afirmativo e o negativo?', 'Afirmativo: ênclise ("Entregue-me"). Negativo: próclise ("Não me entregue").'),
  lc(5, 'Quando se usa a mesóclise?', 'No futuro do presente ou do pretérito, com o verbo iniciando a frase e sem palavra atrativa: "Entregar-te-ei", "Far-se-ia".'),
  lc(6, 'O pronome pode vir depois de particípio?', 'Nunca. Escreve-se "Tinha-se esquecido" ou "Não se tinha esquecido", e não "Tinha esquecido-se".'),
]

// ───────────── Pontuação
export const PONT_LESSON: Lesson = {
  id: 'pt-pontuacao', topicId: 'pt-13', title: 'Pontuação: a vírgula e outros sinais', questionIds: ['pont-1', 'pont-2', 'pont-3', 'pont-4', 'pont-5'],
  steps: [
    { title: 'Entenda',
      body: ['A pontuação organiza o texto e muda o sentido. A vírgula é o sinal mais cobrado, e funciona melhor se você a entender por "regras de uso" e "regras de proibição".',
        'USOS da vírgula: (1) separar itens de uma enumeração ("RG, CPF e título"); (2) isolar vocativo ("Maria, venha ao balcão"); (3) isolar aposto ("Brasília, capital do Brasil, abriga os três Poderes"); (4) isolar expressões explicativas e intercaladas ("ou seja", "isto é", "infelizmente"); (5) separar adjunto adverbial deslocado para o início ("No dia seguinte, o juiz decidiu"; facultativa quando ele é curto); (6) antes de conjunções adversativas e conclusivas ("mas", "porém", "portanto"); (7) isolar oração adjetiva explicativa.',
        'PROIBIÇÕES: não se separa sujeito do verbo ("O escrevente, redigiu" é erro), verbo do complemento ("apresentou, a petição" é erro) nem o nome do seu complemento ou adjunto. A vírgula só aparece entre esses termos quando há um elemento intercalado, que exige vírgula antes E depois.'],
      alt: 'Imagine que a frase é uma fila: sujeito, verbo e complemento são amigos inseparáveis, e a vírgula não pode ficar entre eles. Mas se alguém "entrar de penetra" no meio (um aposto, um vocativo, uma explicação), ele precisa de uma vírgula de cada lado, como duas portas.' },
    { title: 'Exemplo prático',
      body: ['Caso 1 — vocativo: "Senhor Pedro, o processo está pronto." / "O processo está pronto, senhor Pedro."',
        'Caso 2 — aposto: "O juiz, Dr. Paulo, assinou a sentença." As duas vírgulas isolam a informação extra.',
        'Caso 3 — adversativa: "O prazo era curto, mas o advogado entregou a petição." A vírgula vem antes de "mas".',
        'Caso 4 — oração adjetiva restritiva × explicativa: sem vírgula, a oração RESTRINGE o sentido; com vírgula, apenas EXPLICA. "Os servidores que chegaram atrasados foram advertidos" = só alguns chegaram atrasados. "Os servidores, que chegaram atrasados, foram advertidos" = todos chegaram atrasados.',
        'Caso 5 — ponto e vírgula: separa itens de uma enumeração mais longa, principalmente quando eles já têm vírgulas por dentro: "Compareceram o juiz, Dr. Paulo; o promotor, Dr. Ricardo; e a defensora, Dra. Ana." Também separa orações coordenadas mais extensas, no lugar de um ponto.'],
      alt: 'Vírgula errada muda o sentido: "Não, espere" é diferente de "Não espere". Na dúvida, leia a frase em voz alta: onde a voz faz pausa para destacar algo, costuma haver vírgula; mas não é um critério absoluto, porque a pausa NÃO justifica separar sujeito de verbo.' },
    { title: 'Resumo essencial',
      body: ['Resumo dos usos e das proibições.'],
      table: { caption: 'Vírgula: usar × não usar', head: ['Situação', 'Vírgula?', 'Exemplo'], rows: [
        ['Enumeração', 'Sim', 'RG, CPF e título.'],
        ['Vocativo', 'Sim', 'Senhor Pedro, o processo está pronto.'],
        ['Aposto', 'Sim (duas)', 'O juiz, Dr. Paulo, assinou.'],
        ['Antes de "mas", "porém"', 'Sim', 'Era curto, mas entregou.'],
        ['Sujeito + verbo', 'Não', '✗ O escrevente, redigiu.'],
        ['Verbo + complemento', 'Não', '✗ Apresentou, a petição.'],
        ['Oração adjetiva explicativa', 'Sim (duas)', 'Os servidores, que chegaram, foram.']] } },
    { title: 'O que memorizar',
      body: ['• Nunca separe sujeito do verbo nem verbo do complemento.',
        '• Elemento intercalado (aposto, vocativo, explicação): vírgula antes E depois.',
        '• Adjunto adverbial deslocado para o início: vírgula depois dele.',
        '• Antes de "mas", "porém", "contudo", "todavia": vírgula.',
        '• Oração adjetiva: sem vírgula (restritiva) ou com vírgulas (explicativa) — o sentido muda.',
        '• Ponto e vírgula: itens de enumeração longos ou que já contêm vírgulas.'] },
  ],
}
const pq = mkQ('pont', 'pt-13')
export const PONT_QUESTIONS: Question[] = rot([
  pq(1, 'Assinale a alternativa em que a vírgula está empregada de acordo com a norma-padrão.', [
    o('A', 'O escrevente, redigiu a certidão.', 'Errada: a vírgula separa o sujeito do verbo.'),
    o('B', 'A parte autora apresentou, a petição inicial.', 'Errada: a vírgula separa o verbo do seu complemento.'),
    o('C', 'Senhor Pedro, o processo já está pronto.', 'Correta: a vírgula isola o vocativo.'),
    o('D', 'O prazo terminou mas, a parte recorreu.', 'Errada: a vírgula deve vir antes de "mas", e não depois.'),
    o('E', 'Os documentos, foram entregues ontem.', 'Errada: a vírgula separa o sujeito do verbo.')], 'C', 'Fácil'),
  pq(2, 'Considere as frases: I. Os servidores que chegaram atrasados foram advertidos. II. Os servidores, que chegaram atrasados, foram advertidos. Quanto ao sentido, é correto afirmar que', [
    o('A', 'em I, todos os servidores chegaram atrasados.', 'Errada: em I a oração é restritiva e vale só para alguns servidores.'),
    o('B', 'em II, apenas alguns servidores chegaram atrasados.', 'Errada: em II a oração é explicativa e vale para todos.'),
    o('C', 'em I e II, o sentido é exatamente o mesmo.', 'Errada: a vírgula altera o sentido.'),
    o('D', 'em I, apenas alguns chegaram atrasados; em II, todos chegaram atrasados.', 'Correta: sem vírgula, a oração restringe; com vírgulas, apenas explica a todos.'),
    o('E', 'em II, nenhum servidor foi advertido.', 'Errada: nas duas frases houve advertência.')], 'D', 'Médio'),
  pq(3, 'Assinale a alternativa em que a pontuação está de acordo com a norma-padrão.', [
    o('A', 'O prazo era curto, mas o advogado entregou a petição.', 'Correta: a vírgula vem antes da conjunção adversativa "mas".'),
    o('B', 'O prazo era curto mas, o advogado entregou a petição.', 'Errada: a vírgula está depois do "mas" e não antes.'),
    o('C', 'O prazo, era curto mas o advogado entregou, a petição.', 'Errada: separa sujeito do verbo e verbo do complemento.'),
    o('D', 'O prazo era curto mas o advogado, entregou a petição.', 'Errada: separa o sujeito "o advogado" do verbo.'),
    o('E', 'O prazo era curto; mas, o advogado, entregou a petição.', 'Errada: a última vírgula separa sujeito e verbo, e as demais estão mal posicionadas.')], 'A', 'Médio'),
  pq(4, 'Em "Compareceram à audiência o juiz, Dr. Paulo; o promotor, Dr. Ricardo; e a defensora, Dra. Ana.", o ponto e vírgula é empregado para', [
    o('A', 'separar o sujeito do verbo.', 'Errada: sujeito e verbo nunca se separam por ponto e vírgula.'),
    o('B', 'indicar o fim do período.', 'Errada: o fim do período é indicado por ponto final.'),
    o('C', 'introduzir uma citação.', 'Errada: citações costumam ser introduzidas por dois-pontos.'),
    o('D', 'isolar um vocativo.', 'Errada: o vocativo é isolado por vírgulas.'),
    o('E', 'separar itens de uma enumeração que já contêm vírgulas.', 'Correta: o ponto e vírgula organiza itens longos que têm vírgulas internas (aposto).')], 'E', 'Médio'),
  pq(5, 'Assinale a alternativa em que há emprego INDEVIDO de vírgula.', [
    o('A', 'Os autos, ou seja, o processo físico, foram digitalizados.', 'Adequada: as vírgulas isolam a expressão explicativa "ou seja".'),
    o('B', 'No dia seguinte, o juiz proferiu a decisão.', 'Adequada: a vírgula separa o adjunto adverbial deslocado.'),
    o('C', 'Doutor, o processo já está pronto.', 'Adequada: a vírgula isola o vocativo.'),
    o('D', 'O recurso, foi apresentado dentro do prazo.', 'Inadequada: a vírgula separa o sujeito do verbo. Resposta pedida (a que contém emprego indevido).'),
    o('E', 'A decisão foi publicada, mas ninguém recorreu.', 'Adequada: a vírgula vem antes da conjunção adversativa.')], 'D', 'Médio'),
], ['D', 'B', 'A', 'E', 'C'])
const pc2 = mkC('pont', 'pt-13', 'pt-pontuacao')
export const PONT_CARDS: Flashcard[] = [
  pc2(1, 'Quais termos nunca se separam por vírgula?', 'Sujeito e verbo; verbo e complemento (sem elemento intercalado entre eles).'),
  pc2(2, 'Quando a vírgula é obrigatória em dupla (antes e depois)?', 'Para isolar elementos intercalados: aposto, vocativo no meio da frase, expressões explicativas ("ou seja", "isto é") e oração adjetiva explicativa.'),
  pc2(3, 'Onde fica a vírgula com "mas", "porém" e "contudo"?', 'Antes da conjunção: "O prazo era curto, mas o advogado entregou."'),
  pc2(4, 'Qual a diferença entre oração adjetiva restritiva e explicativa na pontuação?', 'Restritiva: sem vírgula, delimita um grupo (só alguns). Explicativa: entre vírgulas, vale para todos.'),
  pc2(5, 'Para que serve o ponto e vírgula?', 'Separar itens de enumerações longas ou que já têm vírgulas internas e orações coordenadas mais extensas.'),
  pc2(6, 'A pausa na fala é critério seguro para usar vírgula?', 'Não. Há pausa entre sujeito e verbo na fala, mas a vírgula ali é proibida na escrita.'),
]

export const PORT_LESSONS = [CONC_LESSON, REG_LESSON, COL_LESSON, PONT_LESSON]
export const PORT_QUESTIONS = [...CONC_QUESTIONS, ...REG_QUESTIONS, ...COL_QUESTIONS, ...PONT_QUESTIONS]
export const PORT_CARDS = [...CONC_CARDS, ...REG_CARDS, ...COL_CARDS, ...PONT_CARDS]
