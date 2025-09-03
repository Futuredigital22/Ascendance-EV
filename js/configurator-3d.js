/**
 * Ascendance EV 3D Configurator
 * Interactive 3D vehicle visualization
 */

class Ascendance3DConfigurator {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.vehicle = null;
        this.currentColor = 0x007bff;
        this.currentWheels = 'standard';
        this.viewMode = 'exterior';
        this.isRotating = false;
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
    }
    
    init() {
        this.setupScene();
        this.setupLighting();
        this.loadVehicle();
        this.setupControls();
        this.animate();
    }
    
    setupScene() {
        const container = document.getElementById('vehicle-3d-viewer');
        if (!container) return;
        
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            45, 
            container.clientWidth / container.clientHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(5, 3, 5);
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        container.appendChild(this.renderer.domElement);
        
        // Handle resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Point light for highlights
        const pointLight = new THREE.PointLight(0xffffff, 0.5);
        pointLight.position.set(-5, 5, 5);
        this.scene.add(pointLight);
    }
    
    loadVehicle() {
        // Create simplified vehicle geometry
        const vehicleGroup = new THREE.Group();
        
        // Main body
        const bodyGeometry = new THREE.BoxGeometry(4, 1.5, 2);
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: this.currentColor,
            shininess: 100
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.75;
        body.castShadow = true;
        body.receiveShadow = true;
        vehicleGroup.add(body);
        
        // Roof
        const roofGeometry = new THREE.BoxGeometry(3, 0.8, 1.8);
        const roofMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x333333,
            shininess: 80
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.set(0, 1.9, 0);
        roof.castShadow = true;
        vehicleGroup.add(roof);
        
        // Wheels
        this.createWheels(vehicleGroup);
        
        // Windows
        this.createWindows(vehicleGroup);
        
        this.vehicle = vehicleGroup;
        this.scene.add(vehicleGroup);
        
        // Center camera on vehicle
        this.centerCamera();
    }
    
    createWheels(parent) {
        const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
        const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
        
        const wheelPositions = [
            { x: 1.5, y: 0.4, z: 1.2 },
            { x: -1.5, y: 0.4, z: 1.2 },
            { x: 1.5, y: 0.4, z: -1.2 },
            { x: -1.5, y: 0.4, z: -1.2 }
        ];
        
        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.position.set(pos.x, pos.y, pos.z);
            wheel.rotation.z = Math.PI / 2;
            wheel.castShadow = true;
            parent.add(wheel);
        });
    }
    
    createWindows(parent) {
        const windowMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x87CEEB, 
            transparent: true, 
            opacity: 0.7 
        });
        
        // Front windshield
        const frontWindowGeometry = new THREE.PlaneGeometry(2, 1);
        const frontWindow = new THREE.Mesh(frontWindowGeometry, windowMaterial);
        frontWindow.position.set(0, 1.5, 1.01);
        parent.add(frontWindow);
        
        // Side windows
        const sideWindowGeometry = new THREE.PlaneGeometry(1.5, 0.8);
        const leftWindow = new THREE.Mesh(sideWindowGeometry, windowMaterial);
        leftWindow.position.set(2.01, 1.5, 0);
        leftWindow.rotation.y = Math.PI / 2;
        parent.add(leftWindow);
        
        const rightWindow = new THREE.Mesh(sideWindowGeometry, windowMaterial);
        rightWindow.position.set(-2.01, 1.5, 0);
        rightWindow.rotation.y = -Math.PI / 2;
        parent.add(rightWindow);
    }
    
    setupControls() {
        const container = document.getElementById('vehicle-3d-viewer');
        
        // Mouse controls
        container.addEventListener('mousedown', (e) => {
            this.isRotating = true;
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        container.addEventListener('mousemove', (e) => {
            if (!this.isRotating) return;
            
            const deltaX = e.clientX - this.mouseX;
            const deltaY = e.clientY - this.mouseY;
            
            this.vehicle.rotation.y += deltaX * 0.01;
            this.vehicle.rotation.x += deltaY * 0.01;
            
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        container.addEventListener('mouseup', () => {
            this.isRotating = false;
        });
        
        // Touch controls for mobile
        container.addEventListener('touchstart', (e) => {
            this.isRotating = true;
            this.mouseX = e.touches[0].clientX;
            this.mouseY = e.touches[0].clientY;
        });
        
        container.addEventListener('touchmove', (e) => {
            if (!this.isRotating) return;
            
            const deltaX = e.touches[0].clientX - this.mouseX;
            const deltaY = e.touches[0].clientY - this.mouseY;
            
            this.vehicle.rotation.y += deltaX * 0.01;
            this.vehicle.rotation.x += deltaY * 0.01;
            
            this.mouseX = e.touches[0].clientX;
            this.mouseY = e.touches[0].clientY;
        });
        
        container.addEventListener('touchend', () => {
            this.isRotating = false;
        });
    }
    
    updateVehicleColor(colorHex) {
        if (!this.vehicle) return;
        
        this.currentColor = colorHex;
        const body = this.vehicle.children.find(child => child.geometry instanceof THREE.BoxGeometry);
        if (body) {
            body.material.color.setHex(colorHex);
        }
    }
    
    updateWheels(wheelType) {
        this.currentWheels = wheelType;
        // Update wheel appearance based on type
        const wheels = this.vehicle.children.filter(child => 
            child.geometry instanceof THREE.CylinderGeometry
        );
        
        wheels.forEach(wheel => {
            switch(wheelType) {
                case 'alloy':
                    wheel.material.color.setHex(0xC0C0C0);
                    break;
                case 'premium':
                    wheel.material.color.setHex(0xFFD700);
                    break;
                default:
                    wheel.material.color.setHex(0x222222);
            }
        });
    }
    
    centerCamera() {
        this.camera.position.set(5, 3, 5);
        this.camera.lookAt(0, 0, 0);
    }
    
    onWindowResize() {
        const container = document.getElementById('vehicle-3d-viewer');
        if (!container) return;
        
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Auto-rotate when not interacting
        if (!this.isRotating && this.vehicle) {
            this.vehicle.rotation.y += 0.005;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// Initialize 3D configurator
document.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE !== 'undefined') {
        window.configurator3D = new Ascendance3DConfigurator();
    }
});
