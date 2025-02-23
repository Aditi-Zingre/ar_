let arToolkitSource, arToolkitContext, arMarkerControls;

document.getElementById("startAR").addEventListener("click", () => {
    startAR("https://your-host.com/pattern-v1.patt");  // Replace with your actual .patt file URL
});

function startAR(patternUrl) {
    console.log("Starting AR with pattern:", patternUrl);

    // Create Three.js scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Initialize AR.js source
    arToolkitSource = new THREEx.ArToolkitSource({
        sourceType: "webcam",
    });

    arToolkitSource.init(() => {
        console.log("AR Toolkit Source initialized");
        arToolkitSource.onResize();
    });

    // Initialize AR.js context
    arToolkitContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: "https://arjs-cors-proxy.herokuapp.com/https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/data/camera_para.dat",
        detectionMode: "mono",
    });

    arToolkitContext.init(() => {
        console.log("AR Toolkit Context initialized");
        camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
    });

    // Use the uploaded .patt file as a marker
    arMarkerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
        type: "pattern",
        patternUrl: patternUrl,  // Use the .patt file here
        changeMatrixMode: "cameraTransformMatrix",
    });

    // Add a 3D object to the scene
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshNormalMaterial();
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0.5, 0);  // Position above marker
    scene.add(cube);

    // Render the scene
    function render() {
        if (arToolkitSource.ready) {
            arToolkitContext.update(arToolkitSource.domElement);
            renderer.render(scene, camera);
        }
        requestAnimationFrame(render);
    }
    render();
}
