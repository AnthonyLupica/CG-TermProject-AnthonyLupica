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

    4) enable vertex attributes and uniforms

    5) draw to screen
*/

// GLOBAL VARS
var gl;
var program;
const mat4 = glMatrix.mat4;

// # number of vertices for a cube
const NumVertices = 36; //(6 faces)(2 triangles/face)(3 vertices/triangle)

// Interactive vars for transformation
var theta = 0;
var speedup = 0;

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
    
    // set viewing window
    gl.viewport(0, 0, canvas.width, canvas.height);
    // set color of canvas (R, G, B, alpha "for opacity")
    gl.clearColor(0.835, 0.815, 0.915, 1.0);
    // for hidden surface removal
    gl.enable(gl.DEPTH_TEST);

    // 1)

    // vertices for a unit cube 
    // 6 faces each with 6 vertices
    const vertices = 
    [
        // Front face
        0.5,  0.5,  0.5,    
        0.5, -0.5,  0.5,    
       -0.5,  0.5,  0.5,
       -0.5,  0.5,  0.5,
        0.5, -0.5,  0.5, 
       -0.5, -0.5,  0.5,
       
       // Left face
       -0.5,  0.5,  0.5, 
       -0.5, -0.5,  0.5, 
       -0.5,  0.5, -0.5,
       -0.5,  0.5, -0.5, 
       -0.5, -0.5,  0.5, 
       -0.5, -0.5, -0.5,
       
       // Back face
       -0.5,  0.5, -0.5,
       -0.5, -0.5, -0.5, 
        0.5,  0.5, -0.5, 
        0.5,  0.5, -0.5, 
       -0.5, -0.5, -0.5, 
        0.5, -0.5, -0.5,

        // Right face 
        0.5,  0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5,  0.5,  0.5,
        0.5,  0.5,  0.5,
        0.5, -0.5,  0.5, 
        0.5, -0.5, -0.5, 

        // Top face
        0.5,  0.5,  0.5,
        0.5,  0.5, -0.5,
       -0.5,  0.5,  0.5,
       -0.5,  0.5,  0.5,
        0.5,  0.5, -0.5, 
       -0.5,  0.5, -0.5,

       // Bottom face
        0.5, -0.5,  0.5, 
        0.5, -0.5, -0.5, 
       -0.5, -0.5,  0.5, 
       -0.5, -0.5,  0.5, 
        0.5, -0.5, -0.5, 
       -0.5, -0.5, -0.5
    ];
     
    // returns an array with three random numbers (0 to < 1)
    // Math objects are built in
    function randomizeColor()
    {
        return [Math.random(), Math.random(), Math.random()];
    }

    // outer-for produces 6 random colors
    // inner-for executes 6 times per color, pushing that
    // color to all vertices for a particular face
    let colors = [];
    for (let face = 0; face < 6; ++face)
    {
        let color_of_face = randomizeColor();
        for (let vertPerFace = 0; vertPerFace < 6; ++vertPerFace)
        {
            colors.push(...color_of_face);
        }
    }

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
    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    // 4)

    // vPosition attribute
    // (linked program, name of attribute in vertex shader)
    const vertexPositionLoc = gl.getAttribLocation(program, 'vPosition');
    gl.enableVertexAttribArray(vertexPositionLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    // (position, elements to read, type, normalized, stride, offset)
    gl.vertexAttribPointer(vertexPositionLoc, 3, gl.FLOAT, false, 0, 0);

    // vColor attribute
    // (linked program, name of attribute in vertex shader)
    const vertexColorLoc = gl.getAttribLocation(program, 'vColor');
    gl.enableVertexAttribArray(vertexColorLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    // (position, elements to read, type, normalized, stride, offset)
    gl.vertexAttribPointer(vertexColorLoc, 3, gl.FLOAT, false, 0, 0);

    // tell webgl which program to use
    gl.useProgram(program);

    //5)

    // call render to draw
    render();
}

//-- Define any user interaction event handlers in this section --//

window.onkeydown = function handleSpace(event) 
{
    console.log("handleSpace() was called");
    if (event.key == ' ')
    {
         speedup += Math.PI/100;
    }
}

//----------------------------------------------------------------//

var render = function() 
{
    // calls for animation
    requestAnimationFrame(render);

    // set canvas color 
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    // get uniform locations 
    const uniformLoc = 
    {
        matrix: gl.getUniformLocation(program, 'transformMatrix')
    };
    
    // create matrix
    const matrix = mat4.create();
    
    //-- section for applying transformations --//

    /* gl-matrix.js objects (mat4) call transformation methods w/ args (output matrix, input matrix, transform vector) */

    // static
    mat4.translate(matrix, matrix, [0.75, -0.5, 0.0]);
    mat4.scale(matrix, matrix, [0.10, 0.10, 0.10]);
    
    // dynamic
    theta += Math.PI/100 + speedup
    mat4.rotateZ(matrix, matrix, theta);
    mat4.rotateY(matrix, matrix, theta);

    //-----------------------------------------//
    
    // map CPU matrix to GPU
    gl.uniformMatrix4fv(uniformLoc.matrix, false, matrix);
    
    // (draw mode, start vertex, how many vertices to draw)
    gl.drawArrays(gl.TRIANGLES, 0, NumVertices); 
}
