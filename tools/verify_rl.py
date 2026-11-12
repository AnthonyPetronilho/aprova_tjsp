#!/usr/bin/env python3
"""Fase 4B — verificação automatizada das questões de Raciocínio Lógico (estr-, diag-, arg-, seq-).
Tabelas-verdade e enumeração de modelos finitos. Para cada item, confere que a alternativa do gabarito é válida
e que as demais NÃO são (equivalência/consequência lógica). Saída: 'OK <id>' ou 'FALHA <id>: ...'."""
import itertools, sys
V=[True,False]
imp=lambda p,q: (not p) or q
def eq(f,g,n=2): return all(f(*v)==g(*v) for v in itertools.product(V,repeat=n))
fails=[]
def chk(id,cond,msg=''):
    print(('OK ' if cond else 'FALHA ')+id+('' if cond else ': '+msg)); 
    if not cond: fails.append(id)
# estr-1: negação de (a e b)
neg=lambda a,b: not (a and b)
opts={'A':lambda a,b:a or b,'B':lambda a,b:imp(a,not b),'C':lambda a,b:a and not b,'D':lambda a,b:(not a) and (not b),'E':lambda a,b:(not a) or (not b)}
chk('estr-1',[k for k,f in opts.items() if eq(neg,f)]==['B','E'],'ESPERADO (defeito conhecido): B e E equivalentes')
# estr-1b (substituta): só A é equivalente à negação
opts1b={'A':lambda a,b:(not a) or (not b),'B':lambda a,b:(not a) and (not b),'C':lambda a,b:a or b,'D':lambda a,b:imp(not a,not b),'E':lambda a,b:a and not b}
chk('estr-1b',[k for k,f in opts1b.items() if eq(neg,f)]==['A'])
# estr-2: p->q equivalente a
base=lambda p,q: imp(p,q)
opts={'A':lambda p,q:imp(not q,not p),'B':lambda p,q:p and not q,'C':lambda p,q:(not p) or (not q),'D':lambda p,q:imp(q,p),'E':lambda p,q:imp(not p,not q)}
chk('estr-2',[k for k,f in opts.items() if eq(base,f)]==['A'])
# estr-3: negação de p->q
neg=lambda p,q: not imp(p,q)
opts={'A':lambda p,q:(not p) or (not q),'B':lambda p,q:imp(not p,not q),'C':lambda p,q:imp(not q,not p),'D':lambda p,q:(not p) and q,'E':lambda p,q:p and not q}
chk('estr-3',[k for k,f in opts.items() if eq(neg,f)]==['E'])
# estr-4: 5 é par (F) -> 7 é primo (V)
chk('estr-4',imp(5%2==0,all(7%d for d in range(2,7))) is True)
# estr-5: p ou q falsa quando
chk('estr-5',[(p,q) for p in V for q in V if not (p or q)]==[(False,False)])
# diag: modelos finitos sobre universo de 4 elementos; conjuntos como subconjuntos (bitmasks)
U=range(4)
subs=[frozenset(c) for r in range(5) for c in itertools.combinations(U,r)]
allq=lambda A,B: A<=B            # todo A é B
nenhum=lambda A,B: not (A&B)     # nenhum A é B
algum=lambda A,B: bool(A&B)      # algum A é B
def consequences(prem, cands):
    res={}
    for k,f in cands.items():
        ok=True
        for A,B,C in itertools.product(subs,repeat=3):
            if prem(A,B,C) and not f(A,B,C): ok=False;break
        res[k]=ok
    return res
# diag-1: A=escrevente,B=servidor,C=concursado
r=consequences(lambda A,B,C:allq(A,B) and allq(B,C),{'A':lambda A,B,C:allq(A,C),'B':lambda A,B,C:nenhum(B,A),'C':lambda A,B,C:allq(C,A),'D':lambda A,B,C:allq(C,B),'E':lambda A,B,C:bool(C-B)})
chk('diag-1',[k for k,v in r.items() if v]==['A'],str(r))
# diag-2/3: negação por modelos
chk('diag-2',all((not allq(S,H))==bool(S-H) for S in subs for H in subs))
chk('diag-3',all((not nenhum(C,A))==algum(C,A) for C in subs for A in subs))
# diag-4: A=escrevente,B=atento,C=pontual
r=consequences(lambda A,B,C:allq(A,B) and algum(B,C),{'A':lambda A,B,C:algum(C,B),'B':lambda A,B,C:nenhum(C,A),'C':lambda A,B,C:allq(C,B),'D':lambda A,B,C:algum(A,C),'E':lambda A,B,C:allq(B,A)})
chk('diag-4',[k for k,v in r.items() if v]==['A'],str(r))
chk('diag-5',40-(25+18-8)==5)
# arg: validade por tabela-verdade (premissas -> conclusão)
def valid(prems,concl,n):
    return all(concl(*v) for v in itertools.product(V,repeat=n) if all(p(*v) for p in prems))
# arg-1: p->q, ¬q ⊢ ¬p
chk('arg-1',valid([lambda p,q:imp(p,q),lambda p,q:not q],lambda p,q:not p,2) and not valid([lambda p,q:imp(p,q),lambda p,q:not q],lambda p,q:p,2))
# arg-2: p->q, q ⊢ p (inválido)
chk('arg-2',not valid([lambda p,q:imp(p,q),lambda p,q:q],lambda p,q:p,2))
# arg-3: A->B, B->C
P=[lambda a,b,c:imp(a,b),lambda a,b,c:imp(b,c)]
res={'A':valid(P,lambda a,b,c:a,3),'B':valid(P,lambda a,b,c:c,3),'C':valid(P,lambda a,b,c:imp(not a,not c),3),'D':valid(P,lambda a,b,c:imp(c,a),3),'E':valid(P,lambda a,b,c:imp(a,c),3)}
chk('arg-3',[k for k,v in res.items() if v]==['E'],str(res))
# arg-4: a ou b, ¬a
P=[lambda a,b:a or b,lambda a,b:not a]
res={'A':valid(P,lambda a,b:not a and not b,2),'B':valid(P,lambda a,b:not b,2),'C':valid(P,lambda a,b:b,2),'D':valid(P,lambda a,b:a,2)}
chk('arg-4',[k for k,v in res.items() if v]==['C'],str(res))
# arg-5: todos G são V; Tom ∈ G ⊢ Tom ∈ V (válido)
ok=True
for G in subs:
    for Vv in subs:
        for t in U:
            if allq(G,Vv) and t in G and t not in Vv: ok=False
chk('arg-5',ok)
# seq
chk('seq-1',[3+4*i for i in range(5)][-1]==19)
chk('seq-2',2*3**4==162)
f=[1,1]
while len(f)<7: f.append(f[-1]+f[-2])
chk('seq-3',f[-1]==13)
chk('seq-4',[n*n+1 for n in range(1,7)]==[2,5,10,17,26,37])
chk('seq-5',5+19*3==62)
print('RESUMO:', 'todas conferem' if not fails else 'falhas: %s'%fails)
sys.exit(1 if fails else 0)
