var gl;
var points = [];

window.onload = function init(){
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl){alert("WebGL Disable Error");}



    var vertices = [
        vec2(-1,1),
        vec2(1,1),
        vec2(1,-1),
        vec2(-1,-1)
    ];

    divideSquare(vertices[0],vertices[1],vertices[2],vertices[3],3);
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points),
    gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
}


function render(){
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0,points.length);
}

function square(a,b,c,d){
    points.push(a,b,c,c,d,a);
}

function divideSquare(a,b,c,d,count){
    if(count == 0){
        square(a,b,c,d);
    }
    else{
        var ab1 = mix(a,b,1/3);
        var ab2 = mix(a,b,2/3);
        var bc1 = mix(b,c,1/3);
        var bc2 = mix(b,c,2/3);
        var cd1 = mix(c,d,1/3);
        var cd2 = mix(c,d,2/3);
        var da1 = mix(d,a,1/3);
        var da2 = mix(d,a,2/3);
        var m1 = mix(ab1,cd2,1/3);
        var m2 = mix(ab2,cd1,1/3);
        var m3 = mix(ab2,cd1,2/3);
        var m4 = mix(ab1,cd2,2/3);
        count--;

        divideSquare(a,ab1,m1,da2,count);
        divideSquare(ab1,ab2,m2,m1,count);
        divideSquare(ab2,b,bc1,m2,count);
        divideSquare(m2,bc1,bc2,m3,count);
        divideSquare(m3,bc2,c,cd1,count);
        divideSquare(m4,m3,cd1,cd2,count);
        divideSquare(da1,m4,cd2,d,count);
        divideSquare(da2,m1,m4,da1,count);
    }
}