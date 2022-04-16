/* 
    Included js file for the term project
*/

/*
    webgl checklist

    1) make vertices 
    
    2) create buffer 
       load vertices into buffer
    
    3) make a vertex shader
       make a fragment shader
       create a program and attach the shaders

    4) enable vertex attributes

    5) draw to screen
*/

// GLOBAL VARS
var gl;

//--initialize canvas--//

window.onload = function initCanvas() 
{
    // console log for succesful call
    console.log('initCanvas() was called');

    const canvas = document.getElementById('TermProject');
    gl = canvas.getContext('webgl');
    
    if (!gl) 
    { 
        alert("WebGL isn't available on your browser");
    }

    // 1)
    const vertices = 
    [
        0, 1, 0,
        1, -1, 0, 
        -1, -1, 0
    ];

    // 2) 
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    // 3)
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var vertexSource = document.getElementById('vertex-shader');
    gl.shaderSource(vertexShader, vertexSource.text);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    var fragmentSource = document.getElementById('fragment-shader');
    gl.shaderSource(fragmentShader, fragmentSource.text);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    // 4)
    const attribLoc = gl.getAttribLocation(program, 'vPosition');
    gl.enableVertexAttribArray(attribLoc);
    // (position, elements to read, type, normalized, stride, offset)
    gl.vertexAttribPointer(attribLoc, 3, gl.FLOAT, false, 0, 0);

    // tell webgl which program to use
    gl.useProgram(program);

    render();
}

var render = function() 
{
    console.log('I was called');
    // (draw mode, start vertex, how many vertices to draw)
    gl.drawArrays(gl.TRIANGLES, 0, 3); 
}
