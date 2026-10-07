export const COLORS=['Blue','Amber','Plum'];
export const PUZZLES=[
 {name:'Find two blues',draws:3,target:[2,0,0],bags:[[3,3,0]],seed:19},
 {name:'A little of each',draws:2,target:[1,1,0],bags:[[3,1,0],[1,3,0]],seed:19},
 {name:'The whole palette',draws:4,target:[1,1,1],bags:[[3,1,1],[1,3,1],[1,1,3]],seed:19},
 {name:'Two pairs',draws:5,target:[2,2,0],bags:[[4,2,0],[2,4,0]],seed:19}
];
export function initial(index=0,seed=PUZZLES[index].seed){const p=PUZZLES[index];return {bags:p.bags.map(b=>[...b]),target:[...p.target],left:p.draws,collected:[0,0,0],seed:seed>>>0,drawn:[],done:false,won:false};}
export const total=b=>b.reduce((a,n)=>a+n,0);
export function random(seed){const next=(Math.imul(1664525,seed)+1013904223)>>>0;return [next,next/4294967296];}
export function draw(state,bagIndex){
 if(state.done||!Number.isInteger(bagIndex)||!state.bags[bagIndex]||total(state.bags[bagIndex])===0)return state;
 const s=structuredClone(state),[seed,r]=random(s.seed);s.seed=seed;let pick=Math.floor(r*total(s.bags[bagIndex])),color=0;
 while(pick>=s.bags[bagIndex][color]){pick-=s.bags[bagIndex][color];color++;}
 s.bags[bagIndex][color]--;s.collected[color]++;s.left--;s.drawn.push({bag:bagIndex,color});s.won=s.target.every((n,i)=>s.collected[i]>=n);s.done=s.won||s.left===0||s.bags.every(b=>!total(b));return s;
}
export function bestChance(bags,needed,left,memo=new Map()){
 if(needed.every(n=>n<=0))return 1;if(left<=0||needed.reduce((a,n)=>a+Math.max(0,n),0)>left)return 0;
 const key=JSON.stringify([bags,needed,left]);if(memo.has(key))return memo.get(key);
 let best=0;for(let b=0;b<bags.length;b++){const count=total(bags[b]);if(!count)continue;let chance=0;for(let c=0;c<3;c++){if(!bags[b][c])continue;const next=bags.map(x=>[...x]);next[b][c]--;const need=[...needed];need[c]=Math.max(0,need[c]-1);chance+=bags[b][c]/count*bestChance(next,need,left-1,memo);}best=Math.max(best,chance);}
 memo.set(key,best);return best;
}
