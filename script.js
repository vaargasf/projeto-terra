const scene = new THREE.Scene();



const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.001,
    1000
);

camera.position.z = 7;


const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('myCanvas')});


scene.add(new THREE.AmbientLight(0x333333));


const directionalLight = new THREE.DirectionalLight(0xffffff, 1);

directionalLight.position.set(4, 3, 4);
scene.add(directionalLight);


const earthMesh = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load('images/1_earth_8k.jpg'),
    bumpMap: new THREE.TextureLoader().load('images/elev_bump_8k.jpg'),
    bumpScale: 0.1
});

const earthGeometry = new THREE.SphereGeometry(2, 32, 32);


const earth = new THREE.Mesh(earthGeometry, earthMesh);


scene.add(earth);

const stars = new THREE.Mesh(new THREE.SphereGeometry(4, 24, 4), new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('images/starfield.jpg'),
    side: THREE.BackSide
}));

scene.add(stars);


renderer.setSize(window.innerWidth, window.innerHeight);


function show() {
    requestAnimationFrame(show);
    earth.rotation.y += 0.0005;
    renderer.render(scene, camera);
}

show();


let isDragging = false;
let previousMousePosition = {
    x: 0,
    y: 0
};

document.addEventListener("mousedown", (event) => {
    isDragging = true;
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
});

document.addEventListener("mousemove", (event) => {
    if(!isDragging) {
        return;
    }

    const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
    };

    const deltaRotation = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
            toRadians(deltaMove.y),
            toRadians(deltaMove.x),
            0,
            'XYZ'
        )
    );

    earth.quaternion.multiplyQuaternions(
        deltaRotation,
        earth.quaternion
    );
    previousMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
});


document.addEventListener("mouseup", (event) => {
    isDragging = false;
});

document.addEventListener("wheel", (event) => {
    camera.position.z += event.deltaY * 0.01;
});

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

