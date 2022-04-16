/* 
    Included js file for the term project
*/

/*
    webgl checklist

    1) make vertices (postion/color)
    
    2) create buffers
       load vertices into buffers
    
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

    const colors = 
    [
        1, 0, 0,
        0, 1, 0, 
        0, 0, 1
    ];

    // 2) 
    const vBuffer = gl.createBuffer();
    // bind this buffer as the current array buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    // load into the currently bound buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    const cBuffer = gl.createBuffer();
    // bind this buffer as the current array buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    // load into the currently bound buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    // 3)
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    // get vertex shader script element from .html
    var vertexSource = document.getElementById('vertex-shader');
    // specify this as the source code to vertexShader
    gl.shaderSource(vertexShader, vertexSource.text);
    // compile the vertex shader 
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    // get fragment shader script element from .html
    var fragmentSource = document.getElementById('fragment-shader');
    // specify this as the source code to fragmentShader
    gl.shaderSource(fragmentShader, fragmentSource.text);
    // compile the fragment shader
    gl.compileShader(fragmentShader);

    // create a program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    // 4)
    // vPosition attribute
    // (linked program, name of attribute in vertex shader)
    const vAttribLoc = gl.getAttribLocation(program, 'vPosition');
    gl.enableVertexAttribArray(vAttribLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    // (position, elements to read, type, normalized, stride, offset)
    gl.vertexAttribPointer(vAttribLoc, 3, gl.FLOAT, false, 0, 0);

    // vColor attribute
    // (linked program, name of attribute in vertex shader)
    const cAttribLoc = gl.getAttribLocation(program, 'vColor');
    gl.enableVertexAttribArray(cAttribLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    // (position, elements to read, type, normalized, stride, offset)
    gl.vertexAttribPointer(cAttribLoc, 3, gl.FLOAT, false, 0, 0);

    // tell webgl which program to use
    gl.useProgram(program);

    //5)
    // call render to draw
    render();
}

var render = function() 
{
    // (draw mode, start vertex, how many vertices to draw)
    gl.drawArrays(gl.TRIANGLES, 0, 3); 
}
