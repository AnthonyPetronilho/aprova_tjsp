import type { Lesson, Question } from '../types'
const o = (id: Question['options'][0]['id'], text: string, why: string) => ({ id, text, why })
// Aula inédita sobre o art. 312 do Código Penal (Anexo VIII, Direito Penal). Redação conferida em fontes públicas;
// o site do Planalto bloqueou o acesso automatizado — confirme a redação vigente em planalto.gov.br.
export const PECULATO_LESSON: Lesson = {
  id: 'dpenal-peculato', topicId: 'dpenal-2', title: 'Peculato (art. 312 do Código Penal)', questionIds: ['pec-1', 'pec-2', 'pec-3', 'pec-4', 'pec-5'],
  steps: [
    { title: 'Entenda',
      body: ['Peculato é o crime de quem, sendo funcionário público, fica com (ou dá destino indevido a) dinheiro, valor ou outro bem móvel que estava sob sua guarda por causa do cargo. Em linguagem simples: é abusar da confiança que o cargo deu ao servidor.',
        'A lei usa palavras que valem ser "traduzidas": "apropriar-se" = agir como se fosse o dono; "desviar" = dar ao bem um destino diferente do devido; "posse em razão do cargo" = o bem está com o servidor por causa da função que ele exerce; "bem móvel" = coisa que pode ser levada de um lugar para outro (dinheiro, computador, veículo — um imóvel não); "proveito próprio ou alheio" = benefício dele mesmo ou de outra pessoa.',
        'Quem é "funcionário público" para a lei penal? O art. 327 (também previsto no seu edital) amplia o conceito: é quem exerce cargo, emprego ou função pública, ainda que transitoriamente ou sem remuneração.'],
      quotes: [{ ref: 'Art. 312, caput', text: 'Apropriar-se o funcionário público de dinheiro, valor ou qualquer outro bem móvel, público ou particular, de que tem a posse em razão do cargo, ou desviá-lo, em proveito próprio ou alheio: Pena - reclusão, de dois a doze anos, e multa.' }],
      alt: 'Imagine que você trabalha numa biblioteca pública e recebe a chave do armário onde ficam os livros mais caros. O armário não é seu: você só mexe nele por causa do seu trabalho. Se vender um desses livros e ficar com o dinheiro, você abusou da confiança que o cargo lhe deu. É essa a ideia do peculato.' },
    { title: 'Exemplo prático',
      body: ['Caso 1 — apropriação: Ana, servidora responsável pela guarda de uma quantia em dinheiro entregue ao órgão, usa esse dinheiro para pagar uma dívida dela. O dinheiro estava com ela por causa do cargo e ela agiu como dona: peculato do caput.',
        'Caso 2 — desvio: Carlos cuida do pagamento de fornecedores do órgão. Em vez de pagar a conta do fornecedor, transfere o dinheiro para a conta de um parente. Ele deu ao dinheiro um destino diferente do devido, em proveito alheio: também é o caput.',
        'Caso 3 — peculato-furto (§ 1º): Daniela trabalha no atendimento e não tem a guarda dos notebooks da repartição. Aproveitando o acesso que o crachá lhe dá, leva um notebook para casa e fica com ele. Ela não tinha a posse do bem, mas se valeu da facilidade que a qualidade de funcionária lhe proporcionou.',
        'Caso 4 — peculato culposo (§ 2º): Eduardo, por descuido, deixa o cofre do setor aberto e um colega subtrai o dinheiro. Eduardo não queria o crime, mas contribuiu com falta de cuidado (culpa) para o crime de outra pessoa.'],
      alt: 'Duas perguntas resolvem a maioria dos casos. (1) O servidor já tinha o bem sob sua responsabilidade por causa do cargo? Se sim e ele ficou com o bem ou deu destino indevido: caput. (2) Se não tinha, mas usou a facilidade do cargo para tirar o bem: § 1º. E se só agiu com descuido, ajudando o crime de outro: § 2º.' },
    { title: 'Resumo essencial',
      body: ['Os nomes "peculato-apropriação", "peculato-desvio" e "peculato-furto" são usados pela doutrina para organizar o artigo; a lei fala apenas em apropriar-se, desviar e subtrair.'],
      quotes: [{ ref: 'Art. 312, § 1º', text: 'Aplica-se a mesma pena, se o funcionário público, embora não tendo a posse do dinheiro, valor ou bem, o subtrai, ou concorre para que seja subtraído, em proveito próprio ou alheio, valendo-se de facilidade que lhe proporciona a qualidade de funcionário.' }],
      table: { caption: 'As modalidades do art. 312', head: ['Modalidade', 'Onde está', 'Tinha a posse do bem?', 'Conduta', 'Pena'], rows: [
        ['Peculato-apropriação', 'caput', 'Sim, em razão do cargo', 'Apropriar-se (agir como dono)', 'Reclusão, 2 a 12 anos, e multa'],
        ['Peculato-desvio', 'caput', 'Sim, em razão do cargo', 'Desviar o bem, em proveito próprio ou alheio', 'Reclusão, 2 a 12 anos, e multa'],
        ['Peculato-furto', '§ 1º', 'Não', 'Subtrair (ou concorrer para que seja subtraído), valendo-se da facilidade do cargo', 'Mesma pena do caput'],
        ['Peculato culposo', '§ 2º', '—', 'Concorrer culposamente para o crime de outrem', 'Detenção, 3 meses a 1 ano']] } },
    { title: 'O que memorizar',
      body: ['• Objeto: dinheiro, valor ou qualquer outro bem móvel, público OU particular (basta estar sob a guarda do servidor em razão do cargo).',
        '• Caput: apropriar-se ou desviar, em proveito próprio ou alheio → reclusão de 2 a 12 anos e multa.',
        '• § 1º: sem a posse, mas valendo-se da facilidade do cargo para subtrair → mesma pena do caput.',
        '• § 2º: peculato culposo → detenção de 3 meses a 1 ano.',
        '• § 3º vale só para o culposo ("no caso do parágrafo anterior"): reparar o dano ANTES da sentença irrecorrível extingue a punibilidade; DEPOIS, reduz de metade a pena imposta.',
        '• Macete: no caput o servidor JÁ TEM o bem; no § 1º ele NÃO TEM; no § 2º ele NÃO QUER o crime, só contribui por descuido.',
        '• Para comparar (próximo módulo do edital, arts. 313 a 317): no art. 313 (peculato mediante erro de outrem) o servidor recebe o bem, no exercício do cargo, por erro de outra pessoa e se apropria dele; a pena é menor que a do art. 312.'],
      quotes: [{ ref: 'Art. 312, § 2º', text: 'Se o funcionário concorre culposamente para o crime de outrem: Pena - detenção, de três meses a um ano.' }, { ref: 'Art. 312, § 3º', text: 'No caso do parágrafo anterior, a reparação do dano, se precede à sentença irrecorrível, extingue a punibilidade; se lhe é posterior, reduz de metade a pena imposta.' }] },
  ],
}
const Q = (n: number, stem: string, options: Question['options'], answer: Question['answer'], difficulty: Question['difficulty']): Question => ({ id: `pec-${n}`, topicId: 'dpenal-2', stem, options, answer, difficulty, origin: 'inedita-ia' })
export const PECULATO_QUESTIONS: Question[] = [
  Q(1, 'De acordo com o art. 312 do Código Penal, a pena prevista para o crime de peculato (caput) é', [
    o('A', 'detenção, de três meses a um ano.', 'Errada: essa é a pena do peculato culposo (§ 2º), não a do caput.'),
    o('B', 'reclusão, de um a quatro anos, e multa.', 'Errada: não corresponde à pena do caput do art. 312, que tem limites maiores.'),
    o('C', 'reclusão, de dois a doze anos, e multa.', 'Correta: é a pena do caput (e também do § 1º).'),
    o('D', 'reclusão, de dois a oito anos.', 'Errada: o máximo é de doze anos e há multa, cumulativamente.'),
    o('E', 'detenção, de dois a doze anos, e multa.', 'Errada: a pena do caput é de reclusão, não de detenção.')], 'C', 'Fácil'),
  Q(2, 'Renata, servidora de um fórum, é responsável pela guarda de uma quantia em dinheiro que um particular entregou ao órgão. Em vez de guardá-la, Renata usa o dinheiro para quitar uma dívida pessoal. Segundo o art. 312 do Código Penal, a conduta de Renata configura', [
    o('A', 'fato atípico, pois o dinheiro pertencia a um particular e não à Administração.', 'Errada: o art. 312 alcança bem "público ou particular" que esteja na posse do funcionário em razão do cargo.'),
    o('B', 'peculato culposo, previsto no § 2º.', 'Errada: Renata agiu de propósito, apropriando-se do dinheiro; o § 2º trata de quem concorre culposamente para crime de outro.'),
    o('C', 'peculato-furto, previsto no § 1º.', 'Errada: o § 1º é para o funcionário que NÃO tem a posse do bem; Renata tinha.'),
    o('D', 'peculato, na modalidade de apropriação prevista no caput.', 'Correta: ela tinha a posse do dinheiro em razão do cargo e se apropriou dele em proveito próprio.'),
    o('E', 'mera infração administrativa, pois o proveito foi apenas pessoal.', 'Errada: "proveito próprio ou alheio" — o proveito pessoal é exatamente uma das hipóteses do caput.')], 'D', 'Médio'),
  Q(3, 'Paulo, servidor que atua no atendimento ao público e não tem responsabilidade pela guarda dos equipamentos do órgão, aproveita o livre acesso à sala de materiais que seu cargo lhe garante e leva para casa, em definitivo, um notebook pertencente à repartição. Nessa situação, Paulo pratica', [
    o('A', 'peculato do caput, pois todo funcionário tem a posse dos bens da repartição.', 'Errada: o caput exige a posse em razão do cargo, e Paulo não tinha a guarda do notebook.'),
    o('B', 'peculato-furto, previsto no § 1º, com a mesma pena do caput.', 'Correta: sem ter a posse, ele subtraiu o bem valendo-se da facilidade que a qualidade de funcionário lhe proporciona.'),
    o('C', 'peculato culposo, pois não havia intenção de prejudicar o órgão.', 'Errada: o culposo é concorrer culposamente para crime de outro; Paulo agiu de propósito.'),
    o('D', 'crime sem relação com o art. 312, pois não tinha a posse do bem.', 'Errada: o § 1º alcança quem, "embora não tendo a posse", subtrai valendo-se da facilidade do cargo.'),
    o('E', 'fato atípico, porque o notebook pertence à própria Administração.', 'Errada: bem público pode ser objeto do peculato.')], 'B', 'Médio'),
  Q(4, 'Marcos, funcionário público, por descuido deixou aberto o cofre do seu setor, o que permitiu que um colega subtraísse dinheiro do órgão. Marcos foi processado por peculato culposo (art. 312, § 2º, do Código Penal). Antes de haver sentença irrecorrível, Marcos reparou integralmente o dano. De acordo com o § 3º do art. 312, essa reparação', [
    o('A', 'extingue a punibilidade.', 'Correta: reparação anterior à sentença irrecorrível, no peculato culposo, extingue a punibilidade.'),
    o('B', 'reduz de metade a pena imposta.', 'Errada: a redução de metade é para a reparação posterior à sentença irrecorrível.'),
    o('C', 'não produz efeito, pois o peculato culposo não admite reparação.', 'Errada: o § 3º trata justamente da reparação "no caso do parágrafo anterior", isto é, do peculato culposo.'),
    o('D', 'apenas diminui a pena em um terço, a critério do juiz.', 'Errada: o § 3º não prevê redução de um terço; prevê extinção da punibilidade (antes) ou redução de metade (depois).'),
    o('E', 'só extingue a punibilidade se ocorrer depois da sentença irrecorrível.', 'Errada: é o inverso do texto — antes extingue; depois apenas reduz de metade a pena.')], 'A', 'Difícil'),
  Q(5, 'Sobre o crime de peculato (art. 312 do Código Penal), assinale a alternativa INCORRETA.', [
    o('A', 'O objeto do crime pode ser dinheiro, valor ou qualquer outro bem móvel, público ou particular.', 'Correta (afirmação verdadeira): é o que diz o caput.'),
    o('B', 'Desviar o bem em proveito alheio também configura o crime previsto no caput.', 'Correta (afirmação verdadeira): o caput fala em "desviá-lo, em proveito próprio ou alheio".'),
    o('C', 'O peculato culposo é punido com detenção, de três meses a um ano.', 'Correta (afirmação verdadeira): pena do § 2º.'),
    o('D', 'No peculato culposo, a reparação do dano posterior à sentença irrecorrível reduz de metade a pena imposta.', 'Correta (afirmação verdadeira): é o que prevê o § 3º.'),
    o('E', 'No peculato-furto (§ 1º), o funcionário tem a posse do bem em razão do cargo.', 'INCORRETA — é a resposta: o § 1º se aplica a quem, "embora não tendo a posse", subtrai o bem valendo-se de facilidade que a qualidade de funcionário lhe proporciona.')], 'E', 'Difícil'),
]
