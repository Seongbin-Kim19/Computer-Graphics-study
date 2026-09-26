var gl;
var points = [];//정점 데이터 보관 배열
var reps;//시행횟수

window.onload = function init(){
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);//캔버스에 webgl세팅하기
    if(!gl){alert("WebGL Disable Error");}



    var vertices = [//시행 횟수가 0인 사각형의 정점 데이터
        vec2(-1,1),
        vec2(1,1),
        vec2(1,-1),
        vec2(-1,-1)
    ];

    //sirepinski carpet의 정점데이터 생성
    divideSquare(vertices[0],vertices[1],vertices[2],vertices[3],3);
    //canvas 생성
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    //쉐이더 연결
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    //색상 정보 할당
    //js에서 생성한 색상정보를 fragment shader에 uniform uColor로 전달
    var colorLocation = gl.getUniformLocation(program, "uColor");
    gl.uniform4f(colorLocation,0.0,0.0,0.0,1.0);
    //버퍼 생성, 연결, 값 할당
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points),
    gl.STATIC_DRAW );
    //버퍼에 있는 데이터를 vertex shader의 vPosition으로 연결
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    //렌더링
    render();
    /*
    버튼을 누를 때마다 색상정보를 랜덤으로 전달
    id가 changeColor인 버튼을 changeColor에 할당
    클릭 이벤트가 발생하면 fragment의 uColor의 값을 랜덤한 값을 지정    
    */
    var changeColor = document.getElementById("changeColor");
    changeColor.addEventListener("click",function(){

        gl.uniform4f(colorLocation,Math.random(),Math.random(),Math.random(),1.0);
        render();//바뀐 생상정보로 다시 rendering
    });


    /*
    스핀박스(reps)에서 시행횟수를 정하고 버튼(applyReps)에서 
    클릭 이벤트가 발생하면 그래픽을 생성
    points 배열을 초기화하고 스핀박스에서 시행횟수를 받아서 
    분할하는 함수를 실행
    points 배열의 데이터들을 다 버퍼로 넣어주고 rendering
    */
    var reps_value = document.getElementById("reps")
    var changeReps = document.getElementById("applyReps");
    changeReps.addEventListener("click",function(){
        points = [];
        reps = Number(reps_value.value);
        divideSquare(vertices[0],vertices[1],vertices[2],vertices[3],reps);
        gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
        render();
    });
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