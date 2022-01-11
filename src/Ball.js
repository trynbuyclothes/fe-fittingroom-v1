import * as THREE from "three";

export default (scene, position, color) => {
  const group = new THREE.Group();

  const geometry = new THREE.SphereGeometry(5, 32, 32);

  const material = new THREE.MeshBasicMaterial({ color });

  const subjectMesh = new THREE.Mesh(geometry, material);

  const subjectWireframe = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial()
  );

  const { x, y, z } = position;
  subjectMesh.position.set(x, y, z);
  subjectWireframe.position.set(x, y, z);

  group.add(subjectMesh);
  // group.add(subjectWireframe)

  scene.add(group);

  group.rotation.z = Math.PI / 4;

  const scale = 4;
  const speed = 0.02;
  const textureOffsetSpeed = 0.02;

  // function update(time) {
  //   const angle = time * speed
  //   group.rotation.y = angle
  //   // subjectMaterial.alphaMap.offset.y = 0.55 + time * textureOffsetSpeed
  //   // subjectWireframe.material.color.setHSL(Math.sin(angle * 2), 0.5, 0.5)
  //   // const scale = (Math.sin(angle * 8) + 6.4) / 5
  //   subjectWireframe.scale.set(scale, scale, scale)
  // }

  // return {
  //   update,
  // }
};
