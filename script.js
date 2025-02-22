let scene, camera, renderer, tunnel, audioContext, analyser, dataArray;
let audio = new Audio();
let playPauseBtn = document.getElementById('playPauseBtn');
let seekBar = document.getElementById('seekBar');
let volumeControl = document.getElementById('volumeControl');

document.getElementById('fileInput').addEventListener('change', function(event) {
    let files = event.target.files;
    if (files.length > 0) {
        audio.src = URL.createObjectURL(files[0]);
        audio.load();
    }
});

playPauseBtn.addEventListener('click', function() {
    if (audio.paused) {
        audio.play();
        playPauseBtn.textContent = "Pause";
        startTunnel();
    } else {
        audio.pause();
        playPauseBtn.textContent = "Play";
    }
});

volumeControl.addEventListener('input', function() {
    audio.volume = volumeControl.value;
});

function startTunnel() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    let geometry = new THREE.CylinderGeometry(5, 5, 20, 32, 1, true);
    let material = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true });
    tunnel = new THREE.Mesh(geometry, material);
    tunnel.rotation.x = Math.PI / 2;
    scene.add(tunnel);
    
    camera.position.z = 10;

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let source = audioContext.createMediaElementSource(audio);
    analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    
    analyser.getByteFrequencyData(dataArray);
    let speed = dataArray[10] / 50;

    tunnel.rotation.y += 0.01;
    tunnel.position.z -= speed;

    renderer.render(scene, camera);
}
