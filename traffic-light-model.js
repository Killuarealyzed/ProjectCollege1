import * as THREE from 'three';

export function createTrafficLight() {
  const group = new THREE.Group();

  // Основной корпус (черный прямоугольник)
  const bodyGeometry = new THREE.BoxGeometry(1, 2.5, 0.6);
  const bodyMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x111111,
    roughness: 0.3,
    metalness: 0.8
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  group.add(body);

  // Функция для создания огня светофора
  function createLight(color, yPos) {
    const lightGroup = new THREE.Group();
    
    // Внешний ободок
    const rimGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.1, 32);
    const rimMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x222222,
      roughness: 0.5
    });
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    rim.rotation.x = Math.PI / 2;
    lightGroup.add(rim);

    // Внутренняя линза
    const lensGeometry = new THREE.SphereGeometry(0.3, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const lensMaterial = new THREE.MeshStandardMaterial({ 
      color: color,
      emissive: color,
      emissiveIntensity: 0.2,
      roughness: 0.2,
      transparent: true,
      opacity: 0.9
    });
    const lens = new THREE.Mesh(lensGeometry, lensMaterial);
    lens.rotation.x = Math.PI / 2;
    lens.position.z = 0.05;
    lightGroup.add(lens);

    // Источник света внутри
    const innerLight = new THREE.PointLight(color, 0.5, 2);
    innerLight.position.set(0, 0, 0.2);
    lightGroup.add(innerLight);

    lightGroup.position.y = yPos;
    lightGroup.position.z = 0.31;
    
    return lightGroup;
  }

  // Создаем три огня: красный (верх), желтый (середина), зеленый (низ)
  const redLight = createLight(0xff0000, 0.8);
  const yellowLight = createLight(0xffaa00, 0);
  const greenLight = createLight(0x00ff00, -0.8);

  group.add(redLight);
  group.add(yellowLight);
  group.add(greenLight);

  // Козырьки над огнями
  function createVisor(yPos) {
    const visorGeometry = new THREE.BoxGeometry(0.8, 0.15, 0.4);
    const visorMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const visor = new THREE.Mesh(visorGeometry, visorMaterial);
    visor.position.set(0, yPos, 0.5);
    visor.rotation.x = -0.2;
    return visor;
  }

  group.add(createVisor(0.8));
  group.add(createVisor(0));
  group.add(createVisor(-0.8));

  // Стойка
  const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 4, 16);
  const poleMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x555555,
    roughness: 0.4,
    metalness: 0.6
  });
  const pole = new THREE.Mesh(poleGeometry, poleMaterial);
  pole.position.y = -2.5;
  group.add(pole);

  // Основание
  const baseGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
  const base = new THREE.Mesh(baseGeometry, poleMaterial);
  base.position.y = -3.6;
  group.add(base);

  return group;
}

// Функция для управления состоянием светофора
export function setTrafficLightState(trafficLight, state) {
  const redLight = trafficLight.children[1];
  const yellowLight = trafficLight.children[2];
  const greenLight = trafficLight.children[3];

  // Сброс всех огней
  redLight.children[1].material.emissiveIntensity = 0.2;
  yellowLight.children[1].material.emissiveIntensity = 0.2;
  greenLight.children[1].material.emissiveIntensity = 0.2;
  redLight.children[2].intensity = 0.5;
  yellowLight.children[2].intensity = 0.5;
  greenLight.children[2].intensity = 0.5;

  // Установка нужного состояния
  if (state === 'red') {
    redLight.children[1].material.emissiveIntensity = 1.5;
    redLight.children[2].intensity = 2;
  } else if (state === 'yellow') {
    yellowLight.children[1].material.emissiveIntensity = 1.5;
    yellowLight.children[2].intensity = 2;
  } else if (state === 'green') {
    greenLight.children[1].material.emissiveIntensity = 1.5;
    greenLight.children[2].intensity = 2;
  }
}
