import test from 'node:test';import assert from 'node:assert/strict';import {PUZZLES,initial,draw,bestChance,total} from '../model.mjs';
import {takeTurn,undoTurn} from '../model.mjs';
test('without-replacement probability agrees with independent combination result',()=>assert.ok(Math.abs(bestChance([[3,3,0]],[2,0,0],3)-.5)<1e-12));
test('certainty, impossibility, and completed target have exact bounds',()=>{assert.equal(bestChance([[2,0,0]],[2,0,0],2),1);assert.equal(bestChance([[0,4,0]],[1,0,0],4),0);assert.equal(bestChance([[1,1,0]],[1,1,0],1),0);assert.equal(bestChance([[0,0,0]],[0,0,0],0),1);});
test('adaptive choice has calculable benefit',()=>{ // Blue first: switch bags (3/4). Amber first: original bag is all blue (1).
 assert.equal(bestChance([[3,1,0],[1,3,0]],[1,1,0],2),3/4*3/4+1/4*1);
});
test('draw conserves stones and target counts without mutating input',()=>{let s=initial(3);const before=structuredClone(s),count=s.bags.reduce((n,b)=>n+total(b),0);for(let i=0;!s.done;i++){s=draw(s,i%2);assert.equal(s.bags.reduce((n,b)=>n+total(b),0)+s.drawn.length,count);assert.equal(s.collected.reduce((a,n)=>a+n,0),s.drawn.length);assert.ok(s.bags.flat().every(n=>n>=0));}assert.deepEqual(before,initial(3));assert.equal(draw(s,0),s);});
test('retry and undo snapshots reproduce the same draw',()=>{const s=initial(2);assert.deepEqual(draw(s,1),draw(initial(2),1));assert.deepEqual(draw(s,1),draw(s,1));assert.equal(s.left,4);});
test('every authored challenge is reachable with its default seed',()=>{function solve(s){if(s.won)return true;if(s.done)return false;return s.bags.some((b,i)=>total(b)>0&&solve(draw(s,i)));}PUZZLES.forEach((p,i)=>assert.ok(solve(initial(i)),p.name));});
test('empty and invalid bag selection is a no-op',()=>{const s=initial();assert.equal(draw(s,-1),s);assert.equal(draw(s,99),s);s.bags[0]=[0,0,0];assert.equal(draw(s,0),s);});
test('Undo restores the bag that was actually drawn from as well as stones and random state',()=>{const start={state:initial(1),selected:1,history:[]},after=takeTurn(start);const changedSelection={...after,selected:0},undo=undoTurn(changedSelection);assert.equal(undo.selected,1);assert.deepEqual(undo.state,start.state);assert.deepEqual(takeTurn(undo),after);assert.equal(start.history.length,0);});
test('invalid draws and empty Undo never add a recovery snapshot',()=>{const s={state:initial(),selected:99,history:[]};assert.equal(takeTurn(s),s);assert.equal(undoTurn(s),s);});
