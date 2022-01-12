import "./styles.css";
//import * as THREE from "three";
import * as THREE from "./build/three.module.js";
import Stats from "./examples/jsm/libs/stats.module.js";
import { OrbitControls } from "./examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "./examples/jsm/loaders/FBXLoader.js";
import { Reflector } from "./examples/jsm/libs/Reflector.js";

document.getElementById("app").innerHTML = `
<h1>Hello Vanilla!</h1>
<div>
  We use Parcel to bundle this sandbox, you can find more info about Parceld
  <a href="https://parceljs.org" target="_blank" rel="noopener noreferrer">here</a>.
</div>
`;

var container, stats, controls;
var camera, scene, renderer, light, hemilight, spotlight;

var clock = new THREE.Clock();
var navbar_height = 80;

var mixer;

init();
animate();

function init() {
  var container = document.createElement("div");
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.set(0, 150, 300);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x101a31);
  //	scene.fog = new THREE.Fog( 0x101A31, 775, 1500 );

  light = new THREE.HemisphereLight(0xffffff, 0x825b4d, 4);
  light.position.set(0, 500, 0);
  scene.add(light);

  var loader = new FBXLoader();

  const path = require("./examples/trynbuyCatwalkcutnobumpB.fbx");

  loader.load(path, function (object) {
    //loader.load( "trynbuycatwalk1", function ( object ) {

    //		mixer = new THREE.AnimationMixer( object );

    //		var action = mixer.clipAction( object.animations[ 0 ] );
    //		action.play();
    var counter = 0;
    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.renderOrder = counter;
        counter = counter + 1;
        //console.log("[DEBUG] Generated meshes:");
        //console.log(child);
        //console.log(child.name);
        child.material.transparent = false;
        //console.log("[DEBUG] Child material:");
        //console.log(Array.isArray(child.material));
        if (Array.isArray(child.material)) {
          for (var i = 0; i < child.material.length; i++) {
            //console.log(child.material[i]);
            child.material[i].transparent = false;
          }
        } else {
          child.material.transparent = false;
        }
        if (child.material.map) child.material.map.anisotropy = 32;
      }
    });

    scene.add(object);
  });

  renderer = new THREE.WebGLRenderer({ antialias: true });
  //renderer.sortObjects = false;
  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.toneMappingExposure = 1.3;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight - navbar_height); //delete navbar height from inner window height
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = true; // enable zoom
  //controls.minDistance = 100; // set zoom boundaries
  //controls.maxDistance = 400; // set zoom boundaries
  controls.enablePan = true; // disable pan
  //controls.enablePan = false; // disable pan
  controls.target.set(0, 100, 0); // camera setting moving origin point
  controls.maxPolarAngle = Math.PI / 2; // do not go below ground
  controls.update();

  window.addEventListener("resize", onWindowResize, false);

  // stats
  // stats = new Stats();
  // container.appendChild( stats.dom );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight - navbar_height); //delete navbar height from inner window height
}

//

function animate() {
  requestAnimationFrame(animate);

  var delta = clock.getDelta();

  if (mixer) mixer.update(delta);

  renderer.render(scene, camera);

  //stats.update();
}
