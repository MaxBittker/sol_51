
// All architectural points connected by straight lines.

let xmlns = "http://www.w3.org/2000/svg";

let svg = document.createElementNS(xmlns,'svg')
let width = document.body.getBoundingClientRect().width
let height = Math.max( document.body.getBoundingClientRect().height, window.innerHeight)
svg.id="drawing51"
svg.style=`
border: 1px solid blue;
position:absolute;
top:0;
z-index:999999;
`
svg.setAttributeNS (null, "width", width);
svg.setAttributeNS (null, "height", height);
svg.setAttributeNS (null, "viewBox", "0 0 " + width + " " + height);
document.body.append(svg)

function features(){
    let all = document.querySelectorAll('div,img,svg')//,h1,h2,h3,h4,h5,img,body,ul,ol,table,button,form,input,textarea,iframe,canvas')
    return Array.prototype.slice.call(all);
}

function points(elements){
    return elements.sort((a,b)=>{
        let {width,  height} = a.getBoundingClientRect()
        let va = width*height;
        let br = b.getBoundingClientRect()
        let vb = br.width*br.height;
        return vb-va;
    }).filter(el=>{
        let {width,height} = el.getBoundingClientRect()
        return width > 50 && height > 50;
    }).map(el=>{
        let {x,y,width,height,bottom,top,left,right} = el.getBoundingClientRect()
        
        let sx = window.pageXoffset ||0;
        let sy = window.pageYoffset ||0;
        // console.log(left,sx)
        // let edges
        return [
            {x:left+sx, y:top+sy, q:0},
            {x:left + sx, y:bottom+sy, q:1},
            {x:right + sx, y:bottom+sy, q:2},
            {x:right +sx, y:top+sy, q:3},
        ];
    })
}

let ps = points(features())
ps = [].concat.apply([], ps);

console.log(ps.length)

function pairings(ps){
    let pps = []
    let p;
    for(var i =0; i<ps.length;i++){
        p = ps.pop()
        for(var j =0; j<ps.length; j++){
          pps.push([p, ps[j]])
        }
    }

    return pps;
}

function validpairing([a,b]){
    return true;
    if( b.x>a.x){
        return validpairing([b, a])
    }

    let relativeB = {x: b.x - a.x, y: b.y-a.y}
    let ang = Math.atan2(relativeB.y, relativeB.x);

    let q = Math.floor(2*(ang+ Math.PI)/Math.PI)%4
    if(q == a.q || (q+2)%4 == b.q){
        return false
    }else{
        return true
    }
}

let pairs = pairings(ps)
//  pairs = pairs.filter(validpairing);

let wall = document.getElementById('drawing51');

function snapline([a,b]){
    let l = document.createElementNS(xmlns,'line');
    l.setAttributeNS(null, 'x1',a.x);
    l.setAttributeNS(null, 'y1',a.y);
    l.setAttributeNS(null, 'x2',b.x);
    l.setAttributeNS(null, 'y2',b.y);
    l.style=`
    stroke-width:1;
    stroke:blue;`
    wall.appendChild(l)
}
console.log(pairs.length)
console.log(pairs)

function draft(lines){
    if( lines.length){
        setTimeout(() => {
            snapline(lines.pop())
            draft(lines)
        }, 1);
    }
}
draft(pairs)