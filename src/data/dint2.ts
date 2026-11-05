import type { Flashcard, Lesson, Question } from '../types'
import { mkW, mkC, spread, step, qids } from './helpers'
import { DINT_A_LESSONS, DINT_A_QUESTIONS, DINT_A_CARDS } from './dint'
// Legislação Interna do TJSP, parte 2: Normas de Serviço da Corregedoria Geral da Justiça, Tomo I.
// Seções do edital: Cap. II Seção I (subseções I e II); Cap. III Seções I, II, V, VI, VII, VIII (subseções I a III) e IX a XIX; Cap. XI Seções I a VII.
// Fonte: texto "atualizado até 22/10/2026" do portal do TJSP (api.tjsp.jus.br), lido em 05/11/2026 por resumo automatizado.
// Não lidos em detalhe: arts. 1.228 a 1.289 (só pontos principais) e subseção IV-V da Seção VIII (art. 100 a 102 lidos em resumo).
const AVISO_C = 'Aviso: texto em paráfrase, lido em resumo automatizado do Tomo I atualizado; as Normas são alteradas por provimentos frequentes. Confirme em tjsp.jus.br (Corregedoria, Normas Judiciais).'

// ───────── 8. Cap. II – função correcional
export const COR_LESSON: Lesson = {
  id: 'in-cg-correcional', topicId: 'dint-5', title: 'NSCGJ Tomo I, Cap. II (arts. 5º a 19): função correcional, correições e procedimentos disciplinares', questionIds: qids('icc'),
  steps: [
    step('Entenda', [
      'Função correcional (art. 5º): consiste em orientar, reorganizar e fiscalizar os órgãos e serviços judiciais de primeira instância e fiscalizar presídios e outros estabelecimentos. É exercida pelo Corregedor Geral e, dentro de seus limites, pelos juízes de primeiro grau. Erros são corrigidos e infrações sancionadas somente após processo administrativo disciplinar regular. As dúvidas sobre a aplicação das Normas são decididas pelo Juiz Corregedor Permanente.',
      'Modalidades (art. 6º): a fiscalização é exercida permanentemente, por correições ordinárias, extraordinárias e visitas correcionais. A ordinária é prevista nas Normas; a extraordinária é excepcional, pode ocorrer a qualquer momento, sem aviso prévio, e ser geral ou parcial; a visita verifica o funcionamento regular da unidade. As atas são enviadas à CGJ em até 60 dias após a correição ordinária, ou em até 15 dias após a extraordinária ou a visita.',
      'Corregedoria Permanente (arts. 7º a 14): o Juiz Corregedor Permanente faz, uma vez por ano, de preferência em dezembro, a correição ordinária em todas as serventias sob sua fiscalização, registrada em livro próprio (art. 8º); ela é anunciada por edital afixado no átrio do fórum e publicado no DJE com pelo menos 15 dias de antecedência, com comunicação à subseção da OAB. Em até 30 dias após assumir a corregedoria permanente em caráter definitivo, o juiz faz a visita correcional inicial (art. 9º). Os servidores ficam à disposição durante os trabalhos (art. 11). Os estabelecimentos prisionais são visitados uma vez por mês (art. 13), pelo próprio Corregedor Permanente, salvo afastamento de 30 dias ou mais; as visitas às cadeias públicas cabem aos juízes das Varas de Execuções Criminais (art. 14).',
      'Apurações, sindicâncias e processos (arts. 15 a 19): tramitam em formato digital e são instaurados pelo Juiz Corregedor Permanente ao qual o servidor esteja subordinado. Há apuração preliminar (infração não caracterizada ou autoria indefinida), sindicância (falta que pode gerar repreensão, suspensão ou multa) e processo administrativo (falta que pode gerar demissão, dispensa, demissão ou dispensa a bem do serviço público ou cassação de aposentadoria). São instaurados por portaria. Em reclamação apresentada em papel, o reclamante tem 45 dias para retirar as peças, sob pena de inutilização. Os prazos são contados em dias corridos e ficam suspensos de 20 de dezembro a 20 de janeiro (art. 15, § 6º). O Corregedor Geral pode avocar o procedimento em qualquer fase (§ 5º). Os recursos são interpostos eletronicamente; nas propostas de demissão, dispensa ou cassação, os autos vão sempre à Corregedoria Geral (art. 17). O Corregedor Geral pode aplicar sanções originariamente e reexaminar decisões absolutórias enquanto a infração não estiver prescrita (art. 18). Propostas de melhoria e expedientes que não apurem irregularidade de servidor são autuados como pedido de providências (art. 19).',
      AVISO_C],
      'Atas: 60 dias (ordinária) e 15 dias (extraordinária e visita). Edital da correição: 15 dias antes. Visita inicial: 30 dias. Visita a presídios: mensal. Prazos suspensos de 20/12 a 20/01.'),
    step('Exemplo prático', [
      'Caso 1 — correição ordinária em dezembro: edital no átrio e no DJE com 15 dias de antecedência e aviso à OAB.',
      'Caso 2 — juiz assume a corregedoria permanente: visita inicial em até 30 dias.',
      'Caso 3 — falta que pode gerar demissão: processo administrativo (e os autos vão à Corregedoria Geral).',
      'Caso 4 — correição extraordinária: sem aviso prévio; ata em até 15 dias.'],
      'Pergunta-teste: a correição ordinária é por mês ou por ano? Uma vez por ano; a visita aos presídios é mensal.'),
    step('Resumo essencial', ['Cap. II.'], undefined, { caption: 'Função correcional', head: ['Tema', 'Regra', 'Art.'], rows: [
      ['Correição ordinária', 'Anual, de preferência em dezembro; edital com 15 dias', '8º'],
      ['Ata da correição ordinária', 'Em até 60 dias', '6º, § 4º'],
      ['Ata de extraordinária/visita', 'Em até 15 dias', '6º, § 4º'],
      ['Visita inicial', 'Em até 30 dias após assumir', '9º'],
      ['Presídios', 'Visita mensal', '13'],
      ['Sindicância', 'Repreensão, suspensão ou multa', '15, II'],
      ['Processo administrativo', 'Demissão, dispensa, cassação', '15, III'],
      ['Prazos', 'Dias corridos; suspensos de 20/12 a 20/01', '15, § 6º']] }),
    step('O que memorizar', ['• 60 e 15 dias para as atas.', '• Edital de 15 dias; correição anual.', '• Visita inicial em 30 dias; presídios todo mês.', '• Prazos suspensos de 20/12 a 20/01.'] ),
  ],
}
const cc = mkW('icc', 'dint-5')
export const COR_QUESTIONS: Question[] = [
  cc(1, 'As atas das correições ordinárias devem ser enviadas à CGJ em até', ['60 dias após a correição.', 'Art. 6º, § 4º.'], [['15 dias após a correição.', '15 dias é o prazo das correições extraordinárias e das visitas.'], ['30 dias após a correição.', 'o prazo é de 60 dias.'], ['90 dias após a correição.', 'o prazo é de 60 dias.'], ['5 dias úteis após a correição.', 'o prazo é de 60 dias.']], 'Médio'),
  cc(2, 'A correição ordinária anual é anunciada por edital, publicado no DJE e afixado no átrio do fórum, com antecedência mínima de', ['15 dias.', 'Art. 8º, § 1º.'], [['5 dias.', 'a antecedência é de 15 dias.'], ['10 dias.', 'a antecedência é de 15 dias.'], ['30 dias.', 'a antecedência é de 15 dias.'], ['48 horas.', 'a antecedência é de 15 dias.']], 'Médio'),
  cc(3, 'O juiz que assume em caráter definitivo a corregedoria permanente deve realizar a visita correcional inicial em até', ['30 dias.', 'Art. 9º.'], [['10 dias.', 'o prazo é de 30 dias.'], ['60 dias.', 'o prazo é de 30 dias.'], ['90 dias.', 'o prazo é de 30 dias.'], ['15 dias.', 'o prazo é de 30 dias.']], 'Médio'),
  cc(4, 'Nos procedimentos disciplinares do Cap. II das Normas, os prazos são contados em dias corridos e ficam suspensos', ['de 20 de dezembro a 20 de janeiro.', 'Art. 15, § 6º.'], [['de 1º a 31 de julho.', 'a suspensão é de 20/12 a 20/01.'], ['de 2 a 31 de janeiro.', 'a suspensão é de 20/12 a 20/01.'], ['durante o carnaval.', 'a suspensão é de 20/12 a 20/01.'], ['nunca ficam suspensos.', 'ficam suspensos de 20/12 a 20/01.']], 'Difícil'),
  cc(5, 'Os estabelecimentos prisionais sujeitos ao juízo são visitados pelo Juiz Corregedor Permanente', ['uma vez por mês.', 'Art. 13.'], [['uma vez por semana.', 'a visita é mensal.'], ['uma vez por ano.', 'a correição anual é outra figura; a visita aos presídios é mensal.'], ['a cada seis meses.', 'a visita é mensal.'], ['apenas quando houver rebelião.', 'a visita é mensal.']], 'Fácil'),
]
const ccc = mkC('icc', 'dint-5', 'in-cg-correcional')
export const COR_CARDS: Flashcard[] = [
  ccc(1, 'Quais as modalidades de fiscalização (art. 6º)?', 'Permanente, correições ordinárias, extraordinárias e visitas correcionais.'),
  ccc(2, 'Prazos das atas?', '60 dias após a ordinária; 15 dias após a extraordinária ou a visita.'),
  ccc(3, 'Como se anuncia a correição ordinária?', 'Edital afixado no átrio e publicado no DJE com 15 dias de antecedência, com comunicação à OAB (art. 8º).'),
  ccc(4, 'Quando é a visita correcional inicial?', 'Em até 30 dias após assumir em caráter definitivo (art. 9º).'),
  ccc(5, 'Sindicância ou processo?', 'Sindicância: repreensão, suspensão ou multa. Processo: demissão, dispensa, a bem do serviço ou cassação (art. 15).'),
  ccc(6, 'Quando os prazos disciplinares ficam suspensos?', 'De 20 de dezembro a 20 de janeiro; contam-se em dias corridos (art. 15, § 6º).'),
]

// ───────── 9. Cap. III – atribuições e sistema informatizado
export const SIS_LESSON: Lesson = {
  id: 'in-cg-sistema', topicId: 'dint-5', title: 'NSCGJ Tomo I, Cap. III (arts. 26 a 29 e 46 a 62): disposições iniciais, atribuições e sistema informatizado oficial', questionIds: qids('icg'),
  steps: [
    step('Entenda', [
      'Disposições iniciais e atribuições (arts. 26 a 29): as regras do capítulo valem para todos os ofícios de justiça, salvo disposição específica. Os servidores dão atendimento prioritário a pessoas com deficiência, idosos, gestantes, lactantes e pessoas acompanhadas de crianças de colo (art. 27). Os ofícios executam os serviços inerentes à competência das varas e da Corregedoria Permanente (art. 28) e os serviços do foro judicial; havendo mais de uma vara, cada ofício recebe numeração ordinal e o nome da vara, e há um ofício ou seção de distribuição (art. 29).',
      'Sistema informatizado oficial (arts. 46 a 62): o registro e a documentação de processos judiciais e administrativos são feitos no sistema oficial ou em livros e classificadores, para preservar a memória dos dados e controlar a tramitação (art. 46). Os servidores devem acompanhar as atualizações e usar todas as funções do sistema (art. 47). A CGJ, com a STI, define níveis de acesso e credenciais; é proibido ceder a senha, e o escrivão comunica à STI as mudanças no quadro funcional (art. 49). Alterações, exclusões e retificações seguem níveis de criticidade, e o sistema preserva os dados alterados e vincula a operação ao usuário (art. 50). Escrivães da distribuição e dos ofícios fazem auditoria semanal e comunicam irregularidades à CGJ (art. 51). Os ofícios devem cadastrar todos os feitos, anotar movimentações e registrar serviços administrativos (art. 52), com cadastro o mais completo possível, qualificação das partes e advogados com inscrição na OAB e conferência antes do arquivamento (art. 53). É vedado excluir partes, que devem receber baixa (art. 54, § 2º). O controle de movimentação se faz só pelo sistema, vedados fichário por nome e fichas em papel (art. 57). A extinção é cadastrada pelo ofício após o trânsito em julgado em hipóteses específicas (art. 59). Em autos físicos de notificação, interpelação, protesto ou produção antecipada de prova, a entrega definitiva é cadastrada em campos próprios; na produção antecipada, os autos ficam 1 mês no cartório para cópias e certidões (art. 60). Cabe aos ofícios registrar segredo de justiça, justiça gratuita, prioridade e benefícios processuais (art. 61).',
      AVISO_C],
      'Auditoria semanal no sistema. Produção antecipada de prova: autos 1 mês no cartório. Proibido ceder a senha. Vedado excluir partes (dar baixa).'),
    step('Exemplo prático', [
      'Caso 1 — idoso e gestante no balcão: atendimento prioritário (art. 27).',
      'Caso 2 — escrivão empresta a senha a colega: proibido (art. 49, § 1º).',
      'Caso 3 — parte cadastrada por engano: não se exclui; dá-se baixa (art. 54, § 2º).',
      'Caso 4 — todas as semanas: auditoria no sistema e comunicação de irregularidades à CGJ (art. 51).'],
      'Pergunta-teste: ficha em papel por nome do réu é permitida? Não; o controle é só pelo sistema.'),
    step('Resumo essencial', ['Sistema oficial.'], undefined, { caption: 'Arts. 26 a 29 e 46 a 62', head: ['Tema', 'Regra', 'Art.'], rows: [
      ['Atendimento prioritário', 'Deficientes, idosos, gestantes, lactantes e quem leva criança de colo', '27'],
      ['Distribuição', 'Ofício ou seção de distribuição nas comarcas com mais de uma vara', '29'],
      ['Senha', 'Vedado cedê-la', '49, § 1º'],
      ['Auditoria', 'Semanal pelos escrivães', '51'],
      ['Partes', 'Não se excluem; baixa', '54, § 2º'],
      ['Controle de movimentação', 'Só pelo sistema; sem fichários', '57'],
      ['Produção antecipada de prova', 'Autos 1 mês no cartório', '60']] }),
    step('O que memorizar', ['• Auditoria semanal; senha pessoal.', '• Sem fichas em papel.', '• Segredo de justiça e gratuidade cadastrados pelos ofícios.'] ),
  ],
}
const cg = mkW('icg', 'dint-5')
export const SIS_QUESTIONS: Question[] = [
  cg(1, 'Os escrivães da distribuição e dos ofícios devem fazer auditoria no sistema oficial com periodicidade', ['semanal.', 'Art. 51.'], [['diária.', 'a auditoria é semanal.'], ['mensal.', 'a auditoria é semanal.'], ['anual.', 'a auditoria é semanal.'], ['trimestral.', 'a auditoria é semanal.']], 'Médio'),
  cg(2, 'Quanto às partes cadastradas no sistema, as Normas determinam que', ['não podem ser excluídas, devendo receber baixa.', 'Art. 54, § 2º.'], [['podem ser excluídas a qualquer tempo pelo escrivão.', 'é vedado excluir partes.'], ['só podem ser excluídas pelo juiz.', 'é vedado excluir partes; dá-se baixa.'], ['são excluídas após o trânsito em julgado.', 'é vedado excluir partes.'], ['são excluídas em caso de erro de digitação.', 'é vedado excluir partes.']], 'Médio'),
  cg(3, 'Em ações de produção antecipada de prova em autos físicos, depois da entrega definitiva os autos ficam no cartório por', ['1 mês, para cópias e certidões.', 'Art. 60.'], [['1 dia.', 'o prazo é de 1 mês.'], ['15 dias.', 'o prazo é de 1 mês.'], ['6 meses.', 'o prazo é de 1 mês.'], ['1 ano.', 'o prazo é de 1 mês.']], 'Difícil'),
  cg(4, 'Em relação à senha de acesso ao sistema oficial, as Normas', ['proíbem cedê-la, devendo o escrivão comunicar à STI as mudanças no quadro funcional.', 'Art. 49.'], [['permitem compartilhá-la entre os servidores do ofício.', 'é proibido ceder a senha.'], ['exigem que a senha seja a mesma para todo o ofício.', 'a credencial é individual.'], ['dispensam a comunicação à STI.', 'o escrivão deve comunicar mudanças.'], ['atribuem sua guarda ao juiz.', 'a credencial é do usuário.']], 'Médio'),
  cg(5, 'O atendimento prioritário previsto no art. 27 das Normas abrange', ['pessoas com deficiência, idosos, gestantes, lactantes e pessoas acompanhadas de crianças de colo.', 'Art. 27.'], [['apenas idosos.', 'abrange também deficientes, gestantes, lactantes e acompanhantes de criança de colo.'], ['apenas advogados.', 'a norma trata de atendimento ao público em geral.'], ['apenas servidores públicos.', 'a norma trata de atendimento ao público em geral.'], ['apenas partes com justiça gratuita.', 'a prioridade não depende de gratuidade.']], 'Fácil'),
]
const ccg = mkC('icg', 'dint-5', 'in-cg-sistema')
export const SIS_CARDS: Flashcard[] = [
  ccg(1, 'Quem tem atendimento prioritário (art. 27)?', 'Pessoas com deficiência, idosos, gestantes, lactantes e pessoas acompanhadas de crianças de colo.'),
  ccg(2, 'Para que serve o sistema oficial (art. 46)?', 'Registrar e documentar os processos judiciais e administrativos, preservar a memória dos dados e controlar a tramitação.'),
  ccg(3, 'Qual a periodicidade da auditoria?', 'Semanal, pelos escrivães da distribuição e dos ofícios (art. 51).'),
  ccg(4, 'Pode excluir partes?', 'Não: dá-se baixa (art. 54, § 2º).'),
  ccg(5, 'Que dados os ofícios devem registrar (art. 61)?', 'Segredo de justiça, justiça gratuita, prioridade e benefícios processuais, além dos dados das partes.'),
  ccg(6, 'Pode usar fichário por nome?', 'Não: o controle de movimentação é só pelo sistema, sem fichários e fichas em papel (art. 57).'),
]

// ───────── 10. Cap. III – livros, classificadores e escrituração
export const LIV_LESSON: Lesson = {
  id: 'in-cg-livros', topicId: 'dint-5', title: 'NSCGJ Tomo I, Cap. III (arts. 63 a 86): livros, classificadores e escrituração', questionIds: qids('icl'),
  steps: [
    step('Entenda', [
      'Livros (arts. 63 a 74): os ofícios mantêm, entre outros, o livro de visitas e correições, o protocolo de feitos e papéis em geral, o registro de procedimentos administrativos e de decisões terminativas e, conforme o caso, os livros de carga de mandados, de remessa à instância superior, de ponto e de registro de sentenças (arts. 63 e 64). Os livros são abertos, numerados, autenticados e encerrados pelo escrivão; é vedado substituir folhas (art. 66). O livro eletrônico de visitas e correições é gerado do procedimento digital e assinado; digitalizado o livro físico, este permanece no local por 2 anos e depois pode ser destruído com segurança (art. 67, § 3º). O registro de sentença é feito em até 5 dias após o retorno dos autos ao cartório pelo juiz (art. 72, § 1º); sentença assinada digitalmente dispensa o registro (§ 6º). Livros de carga e de mandados sem uso podem ser destruídos 2 anos após a última anotação, com autorização do Juiz Corregedor Permanente (art. 74, § 2º).',
      'Classificadores (arts. 75 a 79): são obrigatórios os de atos normativos e decisões do Corregedor Permanente (indexados por assunto), cópias de ofícios expedidos, ofícios recebidos, GRD (guias de recebimento de mandados), relatórios de remessas eletrônicas, documentos retirados e autorizações de destruição. Ofícios e mensagens eletrônicas são guardados por 1 ano; os GRD, por pelo menos 2 anos (arts. 78 e 79).',
      'Escrituração (arts. 80 a 86): papel branco ou reciclado, escrita em português, de preferência eletrônica, em tinta preta ou azul indelével; números em algarismos e por extenso; espaços em branco inutilizados; assinatura imediata, com nome por extenso (art. 80). Evitam-se entrelinhas, rasuras e emendas (art. 81). É proibido usar borracha, raspagem, corretivo ou produtos químicos, assinar atos em branco, abreviar fora dos casos reconhecidos e usar carimbos ou reprodução mecânica da assinatura do juiz (art. 82). A identificação de pessoas se faz por nome completo e CPF ou RG; de empresas, por nome, CNPJ e endereço da sede (art. 83). Os atos exibem o nome e o cargo de quem os elaborou, conferiu e assinou; o escrivão reconhece a firma do juiz em alvarás de soltura, mandados de prisão e atos que exijam autenticação, dispensado quando houver assinatura digital (art. 84). Mandados, cartas e correspondência em geral são assinados pelo escrivão "por ordem do juiz", exigindo a assinatura do juiz atos como mandados de busca e prisão, alvarás de soltura, autorizações gerais, levantamento de depósitos, desconto de pensão alimentícia e ofícios a autoridades (art. 85). As regras da escrituração valem também para o sistema eletrônico (art. 86).',
      AVISO_C],
      'Registro de sentença: 5 dias. Livro de visitas digitalizado: guarda do físico por 2 anos. Ofícios e cartas: 1 ano. GRD: no mínimo 2 anos. Livros de carga: destruição 2 anos após a última anotação.'),
    step('Exemplo prático', [
      'Caso 1 — sentença devolvida ao cartório com assinatura manuscrita: registro em até 5 dias.',
      'Caso 2 — sentença assinada digitalmente: dispensa o registro em livro.',
      'Caso 3 — folha de livro rasurada: é proibido usar corretivo (art. 82); deve-se ressalvar.',
      'Caso 4 — mandado de prisão: assinatura do juiz, com firma reconhecida pelo escrivão se não for digital.'],
      'Pergunta-teste: quem assina um ofício comum? O escrivão, "por ordem do juiz", salvo se a lei exigir a assinatura do juiz.'),
    step('Resumo essencial', ['Prazos de guarda e escrituração.'], undefined, { caption: 'Arts. 63 a 86', head: ['Tema', 'Regra', 'Art.'], rows: [
      ['Registro de sentença', 'Em até 5 dias do retorno dos autos', '72, § 1º'],
      ['Livro físico digitalizado', 'Guarda por 2 anos', '67, § 3º'],
      ['Livros de carga sem uso', 'Destruição 2 anos após a última anotação', '74, § 2º'],
      ['Ofícios e mensagens', 'Guardados por 1 ano', '78'],
      ['GRD', 'No mínimo 2 anos', '79'],
      ['Tinta', 'Preta ou azul, indelével', '80'],
      ['Identificação de pessoas', 'Nome completo e CPF ou RG', '83, § 1º'],
      ['Ofícios a autoridades', 'Assinatura do juiz', '85, § 1º']] }),
    step('O que memorizar', ['• 5 dias, 2 anos, 1 ano.', '• Vedados: corretivo, borracha, carimbo da assinatura do juiz.', '• Sentença digital dispensa registro.'] ),
  ],
}
const cl = mkW('icl', 'dint-5')
export const LIV_QUESTIONS: Question[] = [
  cl(1, 'O registro da sentença no livro próprio deve ocorrer em até', ['5 dias após o retorno dos autos ao cartório.', 'Art. 72, § 1º.'], [['24 horas.', 'o prazo é de 5 dias.'], ['10 dias.', 'o prazo é de 5 dias.'], ['15 dias.', 'o prazo é de 5 dias.'], ['30 dias.', 'o prazo é de 5 dias.']], 'Médio'),
  cl(2, 'Digitalizado o livro físico de visitas e correições, ele deve permanecer no local por', ['2 anos, podendo depois ser destruído com segurança.', 'Art. 67, § 3º.'], [['6 meses.', 'a guarda é de 2 anos.'], ['1 ano.', 'a guarda é de 2 anos.'], ['5 anos.', 'a guarda é de 2 anos.'], ['para sempre, sem possibilidade de destruição.', 'pode ser destruído após 2 anos.']], 'Médio'),
  cl(3, 'Os ofícios e mensagens eletrônicas dos classificadores são guardados por', ['1 ano, podendo depois ser destruídos com autorização do Juiz Corregedor Permanente.', 'Art. 78.'], [['5 anos.', 'a guarda é de 1 ano.'], ['2 anos.', '2 anos é a guarda dos GRD.'], ['30 dias.', 'a guarda é de 1 ano.'], ['10 anos.', 'a guarda é de 1 ano.']], 'Difícil'),
  cl(4, 'Segundo o art. 82 das Normas, é proibido, na escrituração:', ['usar borracha, raspagem, corretivo ou produto químico, assinar atos em branco e usar carimbo da assinatura do juiz.', 'Art. 82.'], [['escrever em tinta azul indelével.', 'a tinta azul ou preta é permitida (art. 80).'], ['inutilizar espaços em branco.', 'é exigido inutilizá-los (art. 80).'], ['assinar imediatamente após a lavratura.', 'é exigido (art. 80).'], ['escrever números em algarismos e por extenso.', 'é exigido (art. 80).']], 'Médio'),
  cl(5, 'Exigem a assinatura do próprio juiz, e não apenas a do escrivão por ordem do juiz,', ['mandados de busca e prisão, alvarás de soltura e ofícios dirigidos a autoridades.', 'Art. 85, § 1º.'], [['todas as cartas e correspondências em geral.', 'em regra, o escrivão assina por ordem do juiz.'], ['as certidões de objeto e pé.', 'as certidões são expedidas pelos ofícios.'], ['as intimações de rotina.', 'em regra, o escrivão assina por ordem do juiz.'], ['os termos de juntada.', 'não é o caso do art. 85, § 1º.']], 'Difícil'),
]
const ccl = mkC('icl', 'dint-5', 'in-cg-livros')
export const LIV_CARDS: Flashcard[] = [
  ccl(1, 'Quando se registra a sentença?', 'Em até 5 dias após o retorno dos autos ao cartório; sentença assinada digitalmente dispensa o registro (art. 72).'),
  ccl(2, 'Qual a guarda do livro físico digitalizado?', '2 anos no local, depois destruição segura (art. 67, § 3º).'),
  ccl(3, 'Prazos de guarda dos classificadores?', 'Ofícios e mensagens: 1 ano; GRD: no mínimo 2 anos (arts. 78 e 79).'),
  ccl(4, 'Como se escreve nos livros?', 'Papel branco ou reciclado; português; tinta preta ou azul indelével; números em algarismos e por extenso; espaços inutilizados (art. 80).'),
  ccl(5, 'Quais as proibições da escrituração (art. 82)?', 'Borracha, raspagem, corretivo, assinatura em branco, abreviaturas fora dos casos admitidos e carimbo da assinatura do juiz.'),
  ccl(6, 'Como se identificam pessoas e empresas?', 'Pessoas: nome completo e CPF ou RG; empresas: nome, CNPJ e endereço da sede (art. 83).'),
]

// ───────── 11. Cap. III – ordem dos serviços
export const ORD_LESSON: Lesson = {
  id: 'in-cg-ordem', topicId: 'dint-5', title: 'NSCGJ Tomo I, Cap. III (arts. 87 a 111): ordem dos serviços, certidões, mandados e ofícios', questionIds: qids('ico'),
  steps: [
    step('Entenda', [
      'Autuação e volumes (arts. 87 a 91): o ofício tem 24 horas para autuar a petição inicial ou denúncia, afixando a etiqueta do sistema. Cada volume tem até 200 folhas, salvo determinação judicial ou para manter uma peça com seus anexos (art. 89). Erros de numeração são certificados, sem renumeração; havendo número repetido, acrescenta-se letra em sequência (art. 91).',
      'Petições, atos e cotas (arts. 92 a 96): as petições chegam pelo setor de protocolo. Toda juntada exige termo próprio, nunca lançado sobre a própria peça (art. 93). Não se lançam termos no verso de petições (art. 95). Proíbem-se cotas marginais ou interlineares, sublinhados e expressões injuriosas (art. 96).',
      'Movimentação (arts. 97 a 99): a conclusão ao juiz ocorre em 1 dia e os atos processuais são executados em 5 dias (art. 97). Não se admitem termos sem data nem autos parados em cartório após assinatura (art. 98). Nenhum processo fica paralisado por mais de 30 dias aguardando diligências; após 30 dias, a diligência é reiterada uma única vez e, sem atendimento, abre-se conclusão ao juiz (art. 99).',
      'Controle de prazos (arts. 100 a 102): o escrivão usa escaninhos numerados de 01 a 31, verificados diariamente. Até o 10º dia do mês seguinte, relaciona os processos com réu preso ou adolescente internado provisoriamente e envia relatório à CGJ; processos desses réus paralisados há mais de 3 meses vão ao juiz (art. 100). Antes da remessa à instância superior, os escrivães revisam a numeração, certificam suspensões de expediente no período recursal e certificam o valor do preparo recolhido (art. 102).',
      'Papéis, certidões, mandados e ofícios (arts. 103 a 111): papéis são conservados e o descarte segue o art. 74, § 2º (art. 103). As certidões são expedidas exclusivamente pelos ofícios, no prazo de 5 dias do pedido (art. 104, § 2º); a certidão de objeto e pé entre ofícios, por e-mail institucional, em 5 dias úteis (§ 3º); a de processo em segredo de justiça depende de despacho do juiz, salvo se requerida por parte ou procurador (§ 5º). Para protesto de decisão transitada em julgado que reconheça obrigação de pagar quantia certa ou alimentos, a certidão é expedida em 3 dias do pedido do credor (art. 104-A, § 1º), e o cancelamento do protesto, comprovada a quitação, é determinado por ofício em 3 dias do protocolo (§ 4º). Os mandados seguem o Cap. VII; os arts. 106 a 110 foram revogados (art. 105). Os ofícios extraídos de processos são datados e identificados pelo número dos autos e partes; os demais são numerados em série anual (art. 111).',
      AVISO_C],
      'Autuação: 24 horas. Volume: 200 folhas. Conclusão: 1 dia; atos: 5 dias. Diligência: 30 dias, reiterada uma vez. Certidão: 5 dias; certidão para protesto: 3 dias.'),
    step('Exemplo prático', [
      'Caso 1 — chega a inicial: autuação em 24 horas.',
      'Caso 2 — autos chegam a 200 folhas: abre-se novo volume, com numeração contínua.',
      'Caso 3 — diligência sem resposta há 30 dias: reitera-se uma única vez; depois, conclusão ao juiz.',
      'Caso 4 — credor pede certidão para protesto da sentença: 3 dias.'],
      'Pergunta-teste: a certidão comum é expedida em quanto tempo? 5 dias do pedido.'),
    step('Resumo essencial', ['Prazos dos arts. 87 a 111.'], undefined, { caption: 'Ordem dos serviços', head: ['Tema', 'Regra', 'Art.'], rows: [
      ['Autuação', '24 horas', '87'],
      ['Volume', 'Até 200 folhas', '89'],
      ['Conclusão ao juiz / atos', '1 dia / 5 dias', '97'],
      ['Paralisação por diligência', 'Não mais de 30 dias; reitera-se uma vez', '99'],
      ['Escaninhos', '01 a 31; verificação diária', '100'],
      ['Relatório de réu preso', 'Até o 10º dia do mês seguinte', '100'],
      ['Certidão comum', '5 dias', '104, § 2º'],
      ['Certidão para protesto', '3 dias', '104-A, § 1º']] }),
    step('O que memorizar', ['• 24 horas, 200 folhas, 1 e 5 dias, 30 dias.', '• Escaninhos 01 a 31; relatório até o dia 10.', '• Certidão: 5 dias; protesto: 3 dias.'] ),
  ],
}
const co = mkW('ico', 'dint-5')
export const ORD_QUESTIONS: Question[] = [
  co(1, 'Recebida a petição inicial, o ofício tem para autuá-la o prazo de', ['24 horas.', 'Art. 87.'], [['5 dias.', 'o prazo é de 24 horas.'], ['48 horas.', 'o prazo é de 24 horas.'], ['10 dias.', 'o prazo é de 24 horas.'], ['30 dias.', 'o prazo é de 24 horas.']], 'Fácil'),
  co(2, 'Segundo o art. 89 das Normas, cada volume dos autos tem, em regra, até', ['200 folhas.', 'Art. 89.'], [['100 folhas.', 'o limite é de 200 folhas.'], ['150 folhas.', 'o limite é de 200 folhas.'], ['300 folhas.', 'o limite é de 200 folhas.'], ['500 folhas.', 'o limite é de 200 folhas.']], 'Médio'),
  co(3, 'Nenhum processo deve ficar paralisado aguardando diligência por mais de 30 dias; após esse prazo, a diligência', ['é reiterada uma única vez e, sem atendimento, abre-se conclusão ao juiz.', 'Art. 99.'], [['é reiterada quantas vezes forem necessárias.', 'a reiteração é uma única vez.'], ['é dispensada, arquivando-se o processo.', 'abre-se conclusão ao juiz.'], ['é cobrada por multa ao escrivão.', 'não é a consequência prevista.'], ['é reiterada a cada 5 dias.', 'a reiteração é uma única vez.']], 'Difícil'),
  co(4, 'As certidões em breve relatório ou inteiro teor são expedidas pelos ofícios em até', ['5 dias a contar do recebimento do pedido.', 'Art. 104, § 2º.'], [['24 horas.', 'o prazo é de 5 dias.'], ['3 dias.', '3 dias é o prazo da certidão para protesto.'], ['15 dias.', 'o prazo é de 5 dias.'], ['30 dias.', 'o prazo é de 5 dias.']], 'Médio'),
  co(5, 'A certidão de decisão transitada em julgado, para protesto, deve ser expedida em', ['3 dias a contar do pedido do credor.', 'Art. 104-A, § 1º.'], [['5 dias úteis.', 'o prazo é de 3 dias.'], ['10 dias.', 'o prazo é de 3 dias.'], ['24 horas.', 'o prazo é de 3 dias.'], ['15 dias.', 'o prazo é de 3 dias.']], 'Difícil'),
]
const cco = mkC('ico', 'dint-5', 'in-cg-ordem')
export const ORD_CARDS: Flashcard[] = [
  cco(1, 'Prazo para autuar?', '24 horas do recebimento da inicial ou denúncia (art. 87).'),
  cco(2, 'Tamanho do volume?', 'Até 200 folhas, salvo determinação judicial ou para manter a peça com anexos (art. 89).'),
  cco(3, 'Prazos de conclusão e de atos?', 'Conclusão ao juiz em 1 dia; atos processuais executados em 5 dias (art. 97).'),
  cco(4, 'O que fazer com diligência parada?', 'Nenhum processo fica parado mais de 30 dias; reitera-se uma única vez e depois conclui-se ao juiz (art. 99).'),
  cco(5, 'Como funcionam os escaninhos?', 'Numerados de 01 a 31, verificados diariamente; relatório de réu preso até o 10º dia do mês seguinte (art. 100).'),
  cco(6, 'Prazos de certidão?', '5 dias do pedido; objeto e pé entre ofícios: 5 dias úteis; para protesto: 3 dias (arts. 104 e 104-A).'),
]

// ───────── 12. Cap. III – comunicações, precatórias e intimações
export const COM_LESSON: Lesson = {
  id: 'in-cg-comunicacoes', topicId: 'dint-5', title: 'NSCGJ Tomo I, Cap. III (arts. 112 a 142): comunicações eletrônicas, cartas precatórias e intimações', questionIds: qids('icm'),
  steps: [
    step('Entenda', [
      'Comunicações oficiais (arts. 112 a 121-C): as comunicações entre ofícios são eletrônicas; só se admitem meios convencionais se o sistema ou o malote digital estiverem indisponíveis (art. 112). Só podem transmitir o responsável pelo ofício, o escrivão, o chefe de seção ou o técnico judiciário (art. 114). O remetente usa a conta institucional, indica no assunto o número do processo e a categoria, anexa PDFs, pede confirmação de entrega e leitura e assina com certificado digital (art. 115). Sem recibo, a mensagem presume-se recebida e lida no primeiro dia útil seguinte ao envio; nas urgentes sem confirmação até o dia seguinte, o remetente telefona, pode reenviar e certifica nos autos (art. 118). Dados da Receita Federal obtidos pelo Infojud exigem certificado ICP-Brasil A-3 (art. 121-A).',
      'Cartas precatórias, rogatórias e arbitrais (arts. 122 a 131): a precatória é feita em três vias, uma servindo de contrafé, e a prova do recolhimento da taxa judiciária é juntada na distribuição (art. 122). Atos que podem ser feitos por meio remoto não são deprecados, salvo hipóteses listadas, como a falta de data na Estação Passiva em 30 dias (pessoas presas ou internadas) ou 90 dias (demais). A precatória não é autuada: os documentos servem de capa, com a etiqueta do distribuidor (art. 125). Pode servir de mandado quando possível (art. 126). Na falta de resposta a pedido de informações, repete-se o pedido e telefona-se ao escrivão deprecado, tudo certificado (art. 127). Precatórias urgentes podem ser enviadas por fax, telegrama, telefone, radiograma ou e-mail, sem remessa do original (art. 130). As rogatórias seguem os modelos aprovados pela CGJ (art. 131).',
      'Intimações (arts. 132 a 142): são eletrônicas sempre que possível e publicadas no Diário da Justiça Eletrônico; os servidores não podem dar informações processuais por telefone (art. 132). Despachos, decisões e sentenças vão à publicação em, no máximo, 3 dias da volta dos autos ao ofício (art. 133). A publicação indica o número do processo, o assunto e as partes, resumo ou transcrição e os advogados com OAB (art. 134). Publicações que omitam elementos exigidos, com prejuízo real, são nulas (art. 136); erros são corrigidos por nova publicação (art. 137). Em segredo de justiça, só as iniciais das partes constam (art. 138). Os escrivães conferem as publicações diariamente (art. 142).',
      AVISO_C],
      'Presunção de recebimento: 1º dia útil seguinte. Precatória: 3 vias; Estação Passiva: 30 dias (presos/internados) ou 90 dias. Publicação: até 3 dias. Conferência das publicações: diária.'),
    step('Exemplo prático', [
      'Caso 1 — e-mail de ofício sem recibo: presume-se recebido e lido no primeiro dia útil seguinte.',
      'Caso 2 — precatória urgente: pode seguir por e-mail, sem enviar o original.',
      'Caso 3 — sentença volta ao cartório: publicação em até 3 dias.',
      'Caso 4 — processo em segredo de justiça: publicação só com as iniciais das partes.'],
      'Pergunta-teste: pode informar andamento por telefone? Não (art. 132).'),
    step('Resumo essencial', ['Comunicações e intimações.'], undefined, { caption: 'Arts. 112 a 142', head: ['Tema', 'Regra', 'Art.'], rows: [
      ['Comunicação entre ofícios', 'Eletrônica; convencional só se houver indisponibilidade', '112'],
      ['Quem transmite', 'Responsável pelo ofício, escrivão, chefe de seção ou técnico', '114'],
      ['Presunção de recebimento', 'Primeiro dia útil seguinte', '118'],
      ['Precatória', 'Três vias; sem autuação', '122 e 125'],
      ['Estação Passiva', 'Sem data em 30 dias (presos) ou 90 dias (demais)', '122'],
      ['Publicação de despachos e sentenças', 'Até 3 dias', '133'],
      ['Segredo de justiça', 'Iniciais das partes', '138'],
      ['Conferência das publicações', 'Diária', '142']] }),
    step('O que memorizar', ['• 3 dias para publicar; 3 vias para a precatória.', '• Recibo ausente = 1º dia útil seguinte.', '• Sem informação processual por telefone.'] ),
  ],
}
const cm = mkW('icm', 'dint-5')
export const COM_QUESTIONS: Question[] = [
  cm(1, 'Despachos, decisões interlocutórias e sentenças devem ser encaminhados à publicação em, no máximo,', ['3 dias da volta dos autos ao ofício.', 'Art. 133.'], [['24 horas.', 'o prazo é de 3 dias.'], ['5 dias.', 'o prazo é de 3 dias.'], ['10 dias.', 'o prazo é de 3 dias.'], ['15 dias.', 'o prazo é de 3 dias.']], 'Médio'),
  cm(2, 'Nas comunicações eletrônicas entre ofícios, não havendo emissão de recibo, a mensagem presume-se recebida e lida', ['no primeiro dia útil seguinte ao envio.', 'Art. 118.'], [['no mesmo dia do envio.', 'a presunção é do primeiro dia útil seguinte.'], ['após 5 dias úteis.', 'a presunção é do primeiro dia útil seguinte.'], ['somente com ligação telefônica.', 'a presunção é do primeiro dia útil seguinte.'], ['após 30 dias.', 'a presunção é do primeiro dia útil seguinte.']], 'Médio'),
  cm(3, 'A carta precatória é feita em', ['três vias, uma delas servindo de contrafé.', 'Art. 122.'], [['duas vias, sem contrafé.', 'são três vias.'], ['uma via única.', 'são três vias.'], ['quatro vias, uma para o MP.', 'são três vias.'], ['cinco vias.', 'são três vias.']], 'Médio'),
  cm(4, 'Os servidores dos ofícios, quanto às informações processuais por telefone,', ['não podem fornecê-las a advogados, promotores, partes ou ao público.', 'Art. 132.'], [['podem fornecê-las a qualquer pessoa.', 'a norma proíbe.'], ['podem fornecê-las somente a advogados.', 'a norma proíbe para todos.'], ['podem fornecê-las com autorização do escrivão.', 'a norma proíbe.'], ['devem fornecê-las em todos os casos.', 'a norma proíbe.']], 'Fácil'),
  cm(5, 'Nas publicações de processos em segredo de justiça, constam', ['apenas as iniciais das partes.', 'Art. 138.'], [['o nome completo das partes e do advogado.', 'constam apenas as iniciais das partes.'], ['o CPF das partes.', 'constam apenas as iniciais.'], ['somente o número do processo.', 'constam as iniciais das partes.'], ['o nome completo apenas do réu.', 'constam as iniciais; só no edital de réu o nome completo aparece (art. 141).']], 'Médio'),
]
const ccm = mkC('icm', 'dint-5', 'in-cg-comunicacoes')
export const COM_CARDS: Flashcard[] = [
  ccm(1, 'Como se comunicam os ofícios?', 'Eletronicamente, pela conta institucional, com PDFs e certificado digital; meios convencionais só em indisponibilidade (arts. 112 a 115).'),
  ccm(2, 'Quando se presume recebida a mensagem sem recibo?', 'No primeiro dia útil seguinte ao envio (art. 118).'),
  ccm(3, 'Como é a precatória?', 'Três vias, uma de contrafé; não é autuada; pode servir de mandado; urgente pode ir por e-mail sem o original (arts. 122 a 130).'),
  ccm(4, 'Prazo para publicar despachos e sentenças?', 'No máximo 3 dias da volta dos autos ao ofício (art. 133).'),
  ccm(5, 'O que conter a publicação?', 'Número do processo, assunto, partes, resumo ou transcrição e advogados com OAB (art. 134).'),
  ccm(6, 'Segredo de justiça nas publicações?', 'Apenas as iniciais das partes (art. 138).'),
]

// ───────── 13. Cap. III – audiências, carga e desentranhamento
export const AUD_LESSON: Lesson = {
  id: 'in-cg-audiencias', topicId: 'dint-5', title: 'NSCGJ Tomo I, Cap. III (arts. 143 a 175): audiências, consulta e carga dos autos e desentranhamento', questionIds: qids('ica'),
  steps: [
    step('Entenda', [
      'Audiências (arts. 143 a 156-A): a designação cabe exclusivamente ao juiz, sem delegação, salvo nos juizados especiais (art. 143). Os termos são ditados pelo juiz, rubricados por ele em todas as folhas e assinados pelos participantes (art. 145). Os depoentes são qualificados com nome, filiação, nacionalidade, nascimento, estado civil, profissão, endereços e documento (art. 147). O servidor confere os processos 10 dias antes das audiências, para verificar intimações e requisições (art. 148). Os depoimentos podem ser gravados em áudio, estenotipia, meio digital ou audiovisual (art. 149); os audiovisuais não são transcritos, salvo recurso com impossibilidade de envio eletrônico (art. 152). Após o trânsito em julgado, a gravação é guardada até o prazo da ação rescisória (cível) ou até a extinção da pena (criminal) (art. 153). A opção da parte pela gravação (CPC, art. 367, § 6º) deve ser comunicada antes do início; para usar a gravação, a parte a transcreve e a contrária tem 5 dias para se manifestar (art. 149-A). É vedada a precatória para oitivas em outras comarcas paulistas, salvo exceções, pelo sistema das Estações Passivas (art. 156-A).',
      'Consulta e carga (arts. 157 a 169): os processos não sigilosos podem ser consultados no balcão por advogados, estagiários e o público, sem desentranhar peças (art. 157). O advogado inscrito na OAB, sem procuração, pode retirar autos por 1 hora para cópia (carga rápida); nos processos findos e não sigilosos, pode retirá-los por 10 dias (arts. 158, 161 e 165). Processos em segredo de justiça só são acessíveis a partes e procuradores constituídos (art. 160). Em prazo comum, só se retiram os autos em conjunto ou por ajuste prévio (art. 164). Não se retém a identidade do advogado como controle de carga (art. 166). Intimado pessoalmente e não devolvendo os autos em 3 dias, o advogado perde a vista fora do cartório e paga multa de meio salário mínimo, com comunicação à OAB (art. 167). Até o 10º dia útil de cada mês, o escrivão relaciona os autos em poder das partes além do prazo e remete ao Juiz Corregedor Permanente (art. 168).',
      'Desentranhamento (arts. 170 a 175): pode ser pedido pelo interessado ou determinado de ofício, com substituição por cópia simples (art. 170); não há substituição quando as peças forem intempestivas ou evidentemente estranhas (art. 171). Deferido, o ofício desentranha, certifica, guarda os documentos e intima o interessado a retirá-los em 5 dias, salvo outro prazo fixado pelo juiz (art. 172). Após a coisa julgada, objetos anexados voltam às partes, que os retiram em 30 dias da intimação, sob pena de destruição (art. 174). O classificador de petições desentranhadas é verificado periodicamente; 11 meses após a notificação, publica-se edital, e os itens devem ser retirados em 30 dias; o procedimento ocorre ao menos uma vez por ano (art. 175).',
      AVISO_C],
      'Conferir processos 10 dias antes da audiência. Carga rápida: 1 hora. Devolução: 3 dias após intimação pessoal; multa de meio salário mínimo. Desentranhamento: retirada em 5 dias. Objetos: 30 dias.'),
    step('Exemplo prático', [
      'Caso 1 — audiência em 20 dias: o servidor confere o processo até 10 dias antes.',
      'Caso 2 — advogado sem procuração quer copiar autos: carga rápida de 1 hora.',
      'Caso 3 — advogado intimado pessoalmente não devolve em 3 dias: perde a vista fora do cartório e paga multa de meio salário mínimo.',
      'Caso 4 — deferido o desentranhamento: a parte é intimada a retirar os documentos em 5 dias.'],
      'Pergunta-teste: quem designa as audiências? Exclusivamente o juiz, salvo nos juizados especiais.'),
    step('Resumo essencial', ['Audiências e carga.'], undefined, { caption: 'Arts. 143 a 175', head: ['Tema', 'Regra', 'Art.'], rows: [
      ['Designação de audiência', 'Exclusivamente do juiz (salvo juizados)', '143'],
      ['Conferência prévia', '10 dias antes da audiência', '148'],
      ['Contestação à transcrição', '5 dias para a parte contrária', '149-A'],
      ['Carga rápida', '1 hora', '165'],
      ['Devolução após intimação pessoal', '3 dias; multa de meio salário mínimo', '167'],
      ['Relatório de autos em poder das partes', 'Até o 10º dia útil de cada mês', '168'],
      ['Retirada de documentos desentranhados', '5 dias', '172'],
      ['Objetos após coisa julgada', '30 dias para retirar', '174']] }),
    step('O que memorizar', ['• 10 dias antes; 5 dias; 1 hora; 3 dias; meio salário mínimo.', '• Gravação guardada até a rescisória (cível) ou extinção da pena (criminal).', '• Segredo de justiça: só partes e procuradores.'] ),
  ],
}
const ca = mkW('ica', 'dint-5')
export const AUD_QUESTIONS: Question[] = [
  ca(1, 'O servidor deve conferir os processos com audiência designada com antecedência de', ['10 dias, para verificar intimações e requisições.', 'Art. 148.'], [['24 horas.', 'a conferência é 10 dias antes.'], ['5 dias.', 'a conferência é 10 dias antes.'], ['30 dias.', 'a conferência é 10 dias antes.'], ['no dia da audiência.', 'a conferência é 10 dias antes.']], 'Médio'),
  ca(2, 'O advogado intimado pessoalmente que não devolver os autos em 3 dias perde a vista fora do cartório e', ['paga multa de meio salário mínimo, com comunicação à OAB.', 'Art. 167.'], [['paga multa de 10 salários mínimos.', 'a multa é de meio salário mínimo.'], ['é preso por desobediência.', 'a norma prevê perda da vista e multa.'], ['perde a procuração nos autos.', 'a norma prevê perda da vista e multa.'], ['não sofre sanção alguma.', 'sofre perda da vista fora do cartório e multa.']], 'Difícil'),
  ca(3, 'A carga rápida de autos tem duração de', ['1 hora.', 'Art. 165.'], [['30 minutos.', 'a duração é de 1 hora.'], ['2 horas.', 'a duração é de 1 hora; 2 a 6 horas é o prazo para cópias com prazo correndo (art. 164).'], ['24 horas.', 'a duração é de 1 hora.'], ['5 dias.', 'a duração é de 1 hora.']], 'Médio'),
  ca(4, 'Deferido o desentranhamento, o interessado é intimado a retirar os documentos em', ['5 dias, salvo outro prazo fixado pelo juiz.', 'Art. 172.'], [['24 horas.', 'o prazo é de 5 dias.'], ['10 dias.', 'o prazo é de 5 dias.'], ['30 dias.', '30 dias é o prazo de retirada de objetos após a coisa julgada.'], ['60 dias.', 'o prazo é de 5 dias.']], 'Médio'),
  ca(5, 'A gravação de audiência, após o trânsito em julgado, é guardada, no processo cível, até', ['o prazo para a ação rescisória.', 'Art. 153.'], [['o fim do ano judiciário.', 'a guarda vai até o prazo da rescisória.'], ['30 dias do trânsito em julgado.', 'a guarda vai até o prazo da rescisória.'], ['a prescrição intercorrente.', 'a guarda vai até o prazo da rescisória.'], ['a extinção da pena.', 'esse é o marco do processo criminal.']], 'Difícil'),
]
const cca = mkC('ica', 'dint-5', 'in-cg-audiencias')
export const AUD_CARDS: Flashcard[] = [
  cca(1, 'Quem designa audiências?', 'Exclusivamente o juiz, sem delegação, salvo nos juizados especiais (art. 143).'),
  cca(2, 'Quando se confere o processo antes da audiência?', '10 dias antes, para verificar intimações e requisições (art. 148).'),
  cca(3, 'Até quando se guarda a gravação?', 'Cível: até o prazo da ação rescisória; criminal: até a extinção da pena (art. 153).'),
  cca(4, 'Quanto dura a carga rápida?', '1 hora; advogado sem procuração pode retirar para cópia (arts. 158 e 165).'),
  cca(5, 'E se o advogado não devolver os autos?', 'Intimado pessoalmente e sem devolver em 3 dias, perde a vista fora do cartório e paga multa de meio salário mínimo (art. 167).'),
  cca(6, 'Prazos do desentranhamento?', 'Retirada em 5 dias (art. 172); objetos após a coisa julgada: 30 dias (art. 174); edital 11 meses após notificação (art. 175).'),
]

// ───────── 14. Cap. III – arquivamento
export const ARQ_LESSON: Lesson = {
  id: 'in-cg-arquivo', topicId: 'dint-5', title: 'NSCGJ Tomo I, Cap. III (arts. 176 a 189-G): arquivamento, desarquivamento e pesquisa', questionIds: qids('iar'),
  steps: [
    step('Entenda', [
      'Arquivamento (arts. 176 a 183): nenhum processo é arquivado sem sentença final ou decisão terminativa (art. 176). Publicada a decisão de arquivamento, o processo permanece 30 dias no ofício e depois é arquivado, feitas as anotações no sistema oficial e no SGDAU (art. 177). Os processos em cumprimento há mais de 1 ano sem bens localizados podem ser arquivados provisoriamente (art. 179). Partes e advogados não consultam nem retiram arquivos do Arquivo Terceirizado (art. 180). O desarquivamento é requerido no juízo onde o processo tramitou, mediante recolhimento da taxa, salvo isenção; o requerente é comunicado e tem 30 dias para se manifestar, sob pena de retorno ao arquivo (art. 181). Em segredo de justiça, só partes e advogados, ou com ordem expressa (art. 182). A pesquisa histórica depende de requerimento prévio à Coordenadoria de Gestão Documental e Arquivos (art. 183).',
      'Primeiro arquivamento e rearquivamento (arts. 184 a 187): os processos são arquivados individualmente, sem caixas; cada processo e volume é indexado no SGDAU, com etiqueta no canto superior esquerdo da capa (art. 184). A remessa ao Arquivo Terceirizado segue cronograma publicado no DJE (art. 185). No rearquivamento, os ofícios inserem no SGDAU os dados necessários (unidade, números, classe e assunto, partes por extenso, advogados, objeto, datas da decisão final, do trânsito e da extinção) (art. 186).',
      'Desarquivamento e requisição (arts. 188 e 189): a falta de comprovante do pagamento da taxa leva à intimação do advogado para pagar em 5 dias, sob pena de o pedido não prosseguir (art. 188). Os ofícios requisitam os autos pelo SGDAU e registram a data no sistema oficial; confirma-se antes que o processo foi ao depósito e não está no ofício; nova requisição só após 10 dias úteis da primeira (art. 189, § 4º).',
      'Pesquisa científica (arts. 189-A a 189-G): o pesquisador se cadastra na Coordenadoria de Gestão Documental e Arquivos, por e-mail institucional, indicando o tema e os processos; assina termo de confidencialidade; a pesquisa precisa ser autorizada pelo presidente da CPAD; a autorização dura 30, 60 ou no máximo 90 dias, renovável se justificada; é isenta da taxa de desarquivamento, mas o pesquisador reembolsa cópias e materiais.',
      AVISO_C],
      'Após a decisão de arquivamento: 30 dias no ofício. Arquivo provisório: cumprimento > 1 ano sem bens. Desarquivamento: 30 dias para o requerente. Reiterar requisição: 10 dias úteis. Taxa em falta: 5 dias. Pesquisa: 30, 60 ou 90 dias.'),
    step('Exemplo prático', [
      'Caso 1 — publicada a sentença de extinção: o processo fica 30 dias no ofício e depois é arquivado.',
      'Caso 2 — execução há 2 anos sem bens: arquivamento provisório.',
      'Caso 3 — desarquivado o processo, o requerente não se manifesta em 30 dias: retorna ao arquivo.',
      'Caso 4 — pesquisador autorizado por 60 dias: pode renovar, se justificar, até o limite de cada autorização (30, 60 ou 90 dias).'],
      'Pergunta-teste: quem pode pedir desarquivamento sem a taxa? O pesquisador científico autorizado.'),
    step('Resumo essencial', ['Arquivo.'], undefined, { caption: 'Arts. 176 a 189-G', head: ['Tema', 'Regra', 'Art.'], rows: [
      ['Pré-arquivamento', '30 dias no ofício após a decisão', '177'],
      ['Arquivo provisório', 'Cumprimento há mais de 1 ano sem bens', '179'],
      ['Desarquivamento', 'Requerente tem 30 dias após a comunicação', '181'],
      ['Taxa não comprovada', '5 dias para pagar', '188'],
      ['Nova requisição', 'Só após 10 dias úteis', '189, § 4º'],
      ['Autorização de pesquisa', '30, 60 ou 90 dias', '189-F'],
      ['Pesquisa científica', 'Isenta da taxa de desarquivamento', '189-G']] }),
    step('O que memorizar', ['• 30 dias antes de arquivar; 30 dias para o requerente.', '• 1 ano sem bens = arquivo provisório.', '• 5 dias para a taxa; 10 dias úteis para nova requisição.'] ),
  ],
}
const ar = mkW('iar', 'dint-5')
export const ARQ_QUESTIONS: Question[] = [
  ar(1, 'Publicada a decisão de arquivamento, o processo permanece no ofício por', ['30 dias, sendo depois arquivado.', 'Art. 177.'], [['5 dias.', 'o prazo é de 30 dias.'], ['10 dias.', 'o prazo é de 30 dias.'], ['60 dias.', 'o prazo é de 30 dias.'], ['1 ano.', 'o prazo é de 30 dias.']], 'Médio'),
  ar(2, 'Podem ser provisoriamente arquivados os processos em cumprimento de sentença há mais de', ['1 ano, sem que se tenham localizado bens.', 'Art. 179.'], [['30 dias, com bens localizados.', 'o prazo é de mais de 1 ano e sem bens.'], ['6 meses, sem bens.', 'o prazo é de mais de 1 ano.'], ['5 anos, com bens.', 'o requisito é não terem sido localizados bens.'], ['2 anos, com bens.', 'o requisito é não terem sido localizados bens.']], 'Difícil'),
  ar(3, 'Comunicado da chegada do processo desarquivado, o requerente tem para se manifestar o prazo de', ['30 dias, sob pena de retorno ao arquivo.', 'Art. 181, parágrafo único.'], [['5 dias.', 'o prazo é de 30 dias.'], ['10 dias.', 'o prazo é de 30 dias.'], ['60 dias.', 'o prazo é de 30 dias.'], ['24 horas.', 'o prazo é de 30 dias.']], 'Médio'),
  ar(4, 'Requisitado o desarquivamento, a repetição do pedido só é admitida após', ['10 dias úteis da requisição original.', 'Art. 189, § 4º.'], [['24 horas.', 'o prazo é de 10 dias úteis.'], ['5 dias corridos.', 'o prazo é de 10 dias úteis.'], ['30 dias corridos.', 'o prazo é de 10 dias úteis.'], ['6 meses.', 'o prazo é de 10 dias úteis.']], 'Difícil'),
  ar(5, 'A autorização para pesquisa científica em processos do Arquivo Terceirizado dura', ['30, 60 ou, no máximo, 90 dias, renovável se justificado.', 'Art. 189-F.'], [['1 ano, improrrogável.', 'dura 30, 60 ou no máximo 90 dias.'], ['6 meses, renovável sem limite.', 'dura 30, 60 ou no máximo 90 dias.'], ['10 dias, improrrogáveis.', 'dura 30, 60 ou no máximo 90 dias.'], ['pelo tempo da pesquisa, sem prazo.', 'dura 30, 60 ou no máximo 90 dias.']], 'Difícil'),
]
const car = mkC('iar', 'dint-5', 'in-cg-arquivo')
export const ARQ_CARDS: Flashcard[] = [
  car(1, 'O que é preciso para arquivar?', 'Sentença final ou decisão terminativa (art. 176); depois da publicação, 30 dias no ofício (art. 177).'),
  car(2, 'Quando há arquivamento provisório?', 'Cumprimento de sentença há mais de 1 ano sem localização de bens (art. 179).'),
  car(3, 'Como se desarquiva?', 'No juízo onde tramitou, com taxa paga (salvo isenção); o requerente tem 30 dias após a comunicação (art. 181).'),
  car(4, 'E se faltar o comprovante da taxa?', 'O advogado é intimado a pagar em 5 dias, sob pena de o pedido não prosseguir (art. 188).'),
  car(5, 'Qual o intervalo entre requisições?', 'Nova requisição só após 10 dias úteis (art. 189, § 4º).'),
  car(6, 'Como é a pesquisa científica?', 'Cadastro na Coordenadoria, termo de confidencialidade, autorização do presidente da CPAD por 30, 60 ou 90 dias, isenta da taxa (arts. 189-A a 189-G).'),
]

// ───────── 15. Cap. XI – processo eletrônico I
export const PE1_LESSON: Lesson = {
  id: 'in-cg-eletronico1', topicId: 'dint-5', title: 'NSCGJ Tomo I, Cap. XI (arts. 1.189 a 1.227): sistema, peticionamento, distribuição e consulta', questionIds: qids('ip1'),
  steps: [
    step('Entenda', [
      'Sistema (arts. 1.189 a 1.195): processo eletrônico é o definido pela Lei 11.419/2006. O sistema do TJSP é o meio de tramitação, comunicação e transmissão de peças. O acesso se dá pelo site do TJSP com certificado digital ICP-Brasil A3, por entes conveniados ou por sistemas internos. A autenticidade é garantida pela certificação digital; as digitalizações têm a mesma força probatória, com os originais preservados até o fim do prazo da ação rescisória. O titular responde pelo sigilo da sua chave privada, e a versão no servidor do TJSP é considerada original.',
      'Peticionamento (arts. 1.196 a 1.207): as petições são eletrônicas, salvo exceções. Os atos são considerados praticados no momento do recebimento, com prazo até 24 horas do último dia, horário de Brasília (art. 1.198). O sistema funciona ininterruptamente, salvo manutenção (art. 1.200). Indisponibilidade: o prazo é prorrogado para o primeiro dia útil após a solução se a falha superar 60 minutos entre 6h e 23h, ou ocorrer entre 23h e 24h; falhas entre 0h e 6h, em feriados e fins de semana não têm esse efeito (art. 1.205). "Indisponibilidade severa" é a falha superior a 3 horas entre 9h e 19h em dias úteis (art. 1.205-A); se durar dois ou mais dias, suspende automaticamente os prazos a partir do 2º dia, com publicação no DJE (arts. 1.205-B e 1.205-C), sem atingir o prazo de 10 dias de ciência de intimações no Portal e-SAJ (art. 1.205-D). Petições em papel só são aceitas nas hipóteses legais em que a parte atua sem advogado (art. 1.206), e documentos de "alimentos de balcão" digitalizados ficam 45 dias à disposição, sendo depois inutilizados (art. 1.207).',
      'Distribuição e protocolo (arts. 1.209 a 1.223): as iniciais são protocoladas pelo eSAJ; iniciais urgentes têm prioridade (art. 1.211); embargos, cumprimento de sentença e restauração são eletrônicos (arts. 1.214 a 1.216). As petições intermediárias são apresentadas eletronicamente (art. 1.220); em indisponibilidade, a petição em papel é recebida, e o requerente tem 45 dias da digitalização para retirá-la, sob pena de inutilização (art. 1.222).',
      'Consulta (arts. 1.224 a 1.227): a consulta no site é livre quanto a movimentações e ao inteiro teor de decisões, sentenças, votos e acórdãos (art. 1.224). Processos em segredo só são consultáveis por partes e procuradores habilitados (art. 1.225). Advogados cadastrados no Portal e-SAJ acessam com certificado ou login e senha; partes recebem senha com a citação (art. 1.226). A terceiro interessado, em processo não sigiloso, é franqueada senha pessoal e intransferível válida por 24 horas; os documentos presenciais podem ser inutilizados após 45 dias da emissão (art. 1.226-A).',
      AVISO_C],
      'Certificado A3. Prazo até 24h do último dia. Falha > 60 min (6h–23h): prorroga. Indisponibilidade severa: > 3 horas (9h–19h); 2 dias: suspende prazos. Papel: 45 dias. Senha de terceiro: 24 horas.'),
    step('Exemplo prático', [
      'Caso 1 — petição às 23h50 do último dia: tempestiva (prazo até 24 horas do último dia, horário de Brasília).',
      'Caso 2 — sistema fora do ar por 90 minutos às 14h: o prazo é prorrogado para o primeiro dia útil seguinte.',
      'Caso 3 — falha de 4 horas às 10h em dia útil: indisponibilidade severa.',
      'Caso 4 — terceiro interessado consulta processo não sigiloso: senha de 24 horas, com confirmação de identidade por videoconferência.'],
      'Pergunta-teste: indisponibilidade às 3h da manhã prorroga prazo? Não (falhas entre 0h e 6h não têm esse efeito).'),
    step('Resumo essencial', ['Cap. XI, parte 1.'], undefined, { caption: 'Arts. 1.189 a 1.227', head: ['Tema', 'Regra', 'Art.'], rows: [
      ['Acesso', 'Certificado digital ICP-Brasil A3', '1.191'],
      ['Momento do ato', 'Recebimento; prazo até 24 horas do último dia', '1.198'],
      ['Prorrogação por indisponibilidade', 'Falha acima de 60 minutos entre 6h e 23h', '1.205'],
      ['Indisponibilidade severa', 'Falha acima de 3 horas entre 9h e 19h em dia útil', '1.205-A'],
      ['Suspensão de prazos', 'Dois ou mais dias, a partir do 2º', '1.205-B'],
      ['Papel digitalizado', 'Retirada em 45 dias', '1.222'],
      ['Senha de terceiro', 'Válida por 24 horas', '1.226-A']] }),
    step('O que memorizar', ['• 60 minutos; 3 horas; 2 dias.', '• 45 dias para retirar papel; 24 horas de senha.', '• Versão no servidor é o original.'] ),
  ],
}
const p1 = mkW('ip1', 'dint-5')
export const PE1_QUESTIONS: Question[] = [
  p1(1, 'No peticionamento eletrônico, a petição é considerada tempestiva se enviada até', ['as 24 horas do último dia do prazo, horário de Brasília.', 'Art. 1.198.'], [['as 18 horas do último dia do prazo.', 'o limite é 24 horas do último dia.'], ['o fim do expediente forense.', 'o limite é 24 horas do último dia.'], ['as 12 horas do último dia do prazo.', 'o limite é 24 horas do último dia.'], ['as 24 horas do dia anterior ao último dia.', 'o limite é 24 horas do último dia.']], 'Fácil'),
  p1(2, 'O prazo é prorrogado para o primeiro dia útil após a solução se a indisponibilidade do sistema superar', ['60 minutos entre 6h e 23h.', 'Art. 1.205.'], [['5 minutos entre 0h e 6h.', 'falhas entre 0h e 6h não geram o efeito.'], ['3 horas entre 9h e 19h.', 'esse é o patamar da indisponibilidade severa.'], ['24 horas em qualquer horário.', 'o patamar é de 60 minutos entre 6h e 23h.'], ['10 minutos em fins de semana.', 'falhas em fins de semana não geram o efeito.']], 'Difícil'),
  p1(3, 'Considera-se "indisponibilidade severa" a falha superior a', ['3 horas entre 9h e 19h em dias úteis.', 'Art. 1.205-A.'], [['60 minutos entre 6h e 23h.', 'esse é o patamar da prorrogação do art. 1.205.'], ['10 horas em qualquer dia.', 'o patamar é de 3 horas entre 9h e 19h em dias úteis.'], ['30 minutos em dias úteis.', 'o patamar é de 3 horas.'], ['1 dia inteiro.', 'o patamar é de 3 horas entre 9h e 19h.']], 'Difícil'),
  p1(4, 'A senha pessoal e intransferível franqueada a terceiro interessado em processo não sigiloso é válida por', ['24 horas.', 'Art. 1.226-A.'], [['1 hora.', 'a validade é de 24 horas.'], ['7 dias.', 'a validade é de 24 horas.'], ['30 dias.', 'a validade é de 24 horas.'], ['1 ano.', 'a validade é de 24 horas.']], 'Médio'),
  p1(5, 'Petição em papel recebida durante indisponibilidade do sistema e digitalizada deve ser retirada pelo requerente em', ['45 dias da digitalização, sob pena de inutilização.', 'Art. 1.222, § 3º.'], [['5 dias.', 'o prazo é de 45 dias.'], ['10 dias.', 'o prazo é de 45 dias.'], ['24 horas.', 'o prazo é de 45 dias.'], ['1 ano.', 'o prazo é de 45 dias.']], 'Médio'),
]
const cp1 = mkC('ip1', 'dint-5', 'in-cg-eletronico1')
export const PE1_CARDS: Flashcard[] = [
  cp1(1, 'Como se acessa o sistema do TJSP?', 'Pelo site, com certificado digital ICP-Brasil A3, por entes conveniados ou por sistemas internos (art. 1.191).'),
  cp1(2, 'Quando se considera praticado o ato?', 'No momento do recebimento; prazo até 24 horas do último dia, horário de Brasília (art. 1.198).'),
  cp1(3, 'Quando a indisponibilidade prorroga prazo?', 'Falha acima de 60 minutos entre 6h e 23h, ou ocorrida entre 23h e 24h (art. 1.205).'),
  cp1(4, 'O que é indisponibilidade severa?', 'Falha superior a 3 horas entre 9h e 19h em dias úteis; se durar 2 dias ou mais, suspende prazos a partir do 2º dia (arts. 1.205-A a C).'),
  cp1(5, 'Quanto tempo ficam os documentos em papel digitalizados?', '45 dias para retirada, depois inutilização (arts. 1.207 e 1.222).'),
  cp1(6, 'Como o terceiro consulta processo não sigiloso?', 'Com senha pessoal e intransferível de 24 horas, após confirmação de identidade (art. 1.226-A).'),
]

// ───────── 16. Cap. XI – processo eletrônico II
export const PE2_LESSON: Lesson = {
  id: 'in-cg-eletronico2', topicId: 'dint-5', title: 'NSCGJ Tomo I, Cap. XI (arts. 1.228 a 1.301): tramitação dos processos eletrônicos e precatórios', questionIds: qids('ip2'),
  steps: [
    step('Entenda', [
      'Tramitação (arts. 1.228 a 1.289, pontos principais): aplicam-se subsidiariamente as demais Normas, no que for compatível. Os processos urgentes são identificados ao serem recebidos (art. 1.229). Há 29 tarjas coloridas obrigatórias para situações como justiça gratuita, réu preso, sigilo e prioridades (art. 1.233), e as filas e fases são verificadas ao menos uma vez por mês (art. 1.236). Os termos de conclusão e vista são dispensados (art. 1.240). As intimações ocorrem pelo DJE, salvo exceções legais (art. 1.246); no portal, a intimação considera-se feita no dia da consulta e, se não houver consulta em 10 dias corridos do envio, no fim desse prazo (art. 1.248-A, IV). As petições juntadas são triadas em até 10 dias corridos do protocolo; havendo pedido de tutela de urgência ou medida protetiva, a conclusão ocorre em até 48 horas (art. 1.257-A). As petições em papel são digitalizadas e mantidas por 45 dias, depois inutilizadas (art. 1.258); os documentos inviáveis de digitalizar são apresentados em 10 dias após o aviso de envio da petição eletrônica (art. 1.259). Peritos são intimados por e-mail e apresentam laudos em PDF pelo e-SAJ com certificado digital (arts. 1.261 e 1.262). A remessa à segunda instância é eletrônica, sem porte de remessa e retorno (art. 1.275). No cumprimento de sentença de processo físico, os autos ficam 30 dias no ofício após o requerimento, e, sem requerimento em 30 dias, o juiz manda arquivar (art. 1.286).',
      'Precatórios e requisições de pequeno valor (Seção VII, arts. 1.290 a 1.301): a tramitação dos ofícios requisitórios ocorre apenas em incidentes individualizados (art. 1.290), e os pedidos a eles relativos são apreciados nesses incidentes (art. 1.291). O precatório complementar é vedado, salvo nas hipóteses da Resolução CNJ 303 (art. 1.293). Nos Juizados da Fazenda, sem advogado, o cadastro é feito pela unidade judicial (art. 1.294). Na Capital, a remessa à UPEFAZ só ocorre após a confirmação do número de ordem pela DEPRE (art. 1.296). O juízo da execução comunica eletronicamente à DEPRE hipóteses como cessão de crédito, sucessão processual e penhora de precatório (art. 1.300).',
      'A leitura do Cap. XI, Seção VI, foi feita em resumo; as demais regras desta seção (como as 18 categorias de modelos de grupo, art. 1.238) não foram conferidas em detalhe. ' + AVISO_C],
      '29 tarjas. Triagem: 10 dias corridos; urgência: 48 horas. Papel: 45 dias. Documentos inviáveis: 10 dias. Intimação pelo portal: 10 dias corridos. Cumprimento físico: 30 dias.'),
    step('Exemplo prático', [
      'Caso 1 — petição com pedido de tutela de urgência: conclusão em até 48 horas.',
      'Caso 2 — intimação enviada ao portal sem consulta: considera-se feita ao fim de 10 dias corridos.',
      'Caso 3 — documento que não pode ser digitalizado: apresentado em 10 dias após o aviso de envio da petição eletrônica.',
      'Caso 4 — pedido de cumprimento de sentença de processo físico: autos 30 dias no ofício.'],
      'Pergunta-teste: precatório complementar é permitido? Em regra, não; só nas hipóteses da Resolução CNJ 303.'),
    step('Resumo essencial', ['Cap. XI, parte 2.'], undefined, { caption: 'Arts. 1.228 a 1.301', head: ['Tema', 'Regra', 'Art.'], rows: [
      ['Tarjas', '29 tarjas coloridas obrigatórias', '1.233'],
      ['Triagem de petições', 'Até 10 dias corridos do protocolo', '1.257-A'],
      ['Tutela de urgência / medida protetiva', 'Conclusão em até 48 horas', '1.257-A, § 1º'],
      ['Papel digitalizado', '45 dias e inutilização', '1.258'],
      ['Documento inviável de digitalizar', '10 dias para apresentar', '1.259'],
      ['Intimação no portal sem consulta', '10 dias corridos', '1.248-A'],
      ['Precatórios', 'Incidentes individualizados; complementar vedado', '1.290 e 1.293']] }),
    step('O que memorizar', ['• 29 tarjas; 10 dias corridos; 48 horas; 45 dias; 10 dias.', '• Ofícios requisitórios em incidentes individualizados.', '• Precatório complementar: só CNJ 303.'] ),
  ],
}
const p2 = mkW('ip2', 'dint-5')
export const PE2_QUESTIONS: Question[] = [
  p2(1, 'As petições juntadas aos processos eletrônicos devem ser triadas em até', ['10 dias corridos do protocolo.', 'Art. 1.257-A.'], [['24 horas.', 'a triagem é em até 10 dias corridos.'], ['48 horas.', '48 horas é o prazo de conclusão nos pedidos de tutela de urgência.'], ['30 dias.', 'a triagem é em até 10 dias corridos.'], ['5 dias úteis.', 'a triagem é em até 10 dias corridos.']], 'Médio'),
  p2(2, 'Havendo pedido de tutela de urgência ou medida protetiva, a conclusão ao juiz ocorre em até', ['48 horas.', 'Art. 1.257-A, § 1º.'], [['24 horas.', 'o prazo é de 48 horas.'], ['5 dias.', 'o prazo é de 48 horas.'], ['10 dias corridos.', '10 dias é o prazo da triagem geral.'], ['72 horas.', 'o prazo é de 48 horas.']], 'Médio'),
  p2(3, 'As petições em papel, digitalizadas, são mantidas por', ['45 dias e depois inutilizadas, salvo determinação do juiz.', 'Art. 1.258.'], [['10 dias e depois devolvidas.', 'o prazo é de 45 dias.'], ['1 ano e depois arquivadas.', 'o prazo é de 45 dias.'], ['5 anos.', 'o prazo é de 45 dias.'], ['30 dias, em qualquer caso.', 'o prazo é de 45 dias.']], 'Médio'),
  p2(4, 'Os documentos inviáveis de serem digitalizados devem ser apresentados em', ['10 dias após o aviso de envio da petição eletrônica.', 'Art. 1.259.'], [['24 horas.', 'o prazo é de 10 dias.'], ['5 dias.', 'o prazo é de 10 dias.'], ['45 dias.', '45 dias é o prazo de guarda das petições em papel.'], ['30 dias.', 'o prazo é de 10 dias.']], 'Difícil'),
  p2(5, 'Quanto ao precatório complementar, as Normas dispõem que ele é', ['vedado, salvo nas hipóteses da Resolução CNJ 303.', 'Art. 1.293.'], [['sempre admitido.', 'é vedado, salvo as hipóteses da Resolução CNJ 303.'], ['admitido apenas na Capital.', 'é vedado, salvo as hipóteses da Resolução CNJ 303.'], ['dependente de ordem do Presidente.', 'é vedado, salvo as hipóteses da Resolução CNJ 303.'], ['obrigatório em todo cumprimento contra a Fazenda.', 'é vedado, salvo as hipóteses da Resolução CNJ 303.']], 'Difícil'),
]
const cp2 = mkC('ip2', 'dint-5', 'in-cg-eletronico2')
export const PE2_CARDS: Flashcard[] = [
  cp2(1, 'Prazo de triagem das petições?', 'Até 10 dias corridos do protocolo; com tutela de urgência ou medida protetiva, conclusão em até 48 horas (art. 1.257-A).'),
  cp2(2, 'Quantas tarjas são obrigatórias?', '29 tarjas coloridas (art. 1.233).'),
  cp2(3, 'Quando a intimação do portal se considera feita?', 'No dia da consulta; sem consulta em 10 dias corridos, ao fim desse prazo (art. 1.248-A, IV).'),
  cp2(4, 'O que se faz com a petição em papel?', 'É digitalizada e mantida por 45 dias, depois inutilizada (art. 1.258).'),
  cp2(5, 'Como tramitam os requisitórios?', 'Apenas em incidentes individualizados (art. 1.290); precatório complementar vedado, salvo CNJ 303 (art. 1.293).'),
  cp2(6, 'Como é o cumprimento de sentença físico?', 'Autos 30 dias no ofício após o requerimento; sem requerimento em 30 dias, o juiz manda arquivar (art. 1.286).'),
]

export const DINT_LESSONS = [...DINT_A_LESSONS, COR_LESSON, SIS_LESSON, LIV_LESSON, ORD_LESSON, COM_LESSON, AUD_LESSON, ARQ_LESSON, PE1_LESSON, PE2_LESSON]
export const DINT_QUESTIONS = spread([...DINT_A_QUESTIONS, ...COR_QUESTIONS, ...SIS_QUESTIONS, ...LIV_QUESTIONS, ...ORD_QUESTIONS, ...COM_QUESTIONS, ...AUD_QUESTIONS, ...ARQ_QUESTIONS, ...PE1_QUESTIONS, ...PE2_QUESTIONS], 3)
export const DINT_CARDS = [...DINT_A_CARDS, ...COR_CARDS, ...SIS_CARDS, ...LIV_CARDS, ...ORD_CARDS, ...COM_CARDS, ...AUD_CARDS, ...ARQ_CARDS, ...PE1_CARDS, ...PE2_CARDS]
