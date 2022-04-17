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
const vec3 = glMatrix.vec3;

const NumPoints = 10000; // number of points to generate in the volume

// Interactive vars for transformation
var theta = 0;
var speedup = 0;

// pointCloud accepts a parameter for the "numPoints" to generate
// and returns an array of numPoints*3 vertices
function galaxy(numPoints)
{
    let points = [];
    for (let i = 0; i < numPoints; ++i)
    {
        // generate a random point within a radius of 0.5 of the origin
        // Math.random() generates numbers in [0, 1), so we subtract by 0.5
        // to generate numbers in [-0.5, 0.5)
        const x = Math.random() - 0.5;
        const y = Math.random() - 0.5;
        const z = Math.random() - 0.5;

        const randomPoint = [x, y, z];

        // normalizing the points brings them all into a constant distance from the origin (aka a sphere)
        vec3.normalize(randomPoint, randomPoint);

        points.push(...randomPoint);
    }
    return points;
}

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
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // for hidden surface removal
    gl.enable(gl.DEPTH_TEST);

    // 1)

    // vertex array for the point cloud
    const vertices = galaxy(NumPoints);
    
    // 2) 

    const vBuffer = gl.createBuffer();
    // bind this buffer as the current array buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    // load into the currently bound buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
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
    mat4.translate(matrix, matrix, [0.0, 0.25, 0.0]);
    mat4.scale(matrix, matrix, [0.5, 0.5, 0.5]);
    
    // dynamic
    theta += Math.PI/100 + speedup
    mat4.rotateZ(matrix, matrix, theta);
    mat4.rotateY(matrix, matrix, theta);

    //-----------------------------------------//
    
    // map CPU matrix to GPU
    gl.uniformMatrix4fv(uniformLoc.matrix, false, matrix);
    
    // (draw mode, start vertex, how many vertices to draw)
    gl.drawArrays(gl.POINTS, 0, NumPoints); 
}
