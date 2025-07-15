// Add event listener for each section with the class "toggleClip"

const sections = document.querySelectorAll('.toggleClipSection');

sections.forEach((section, index) => {
    section.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        const oval = section.querySelector('.oval');
        const exploreButton = section.querySelector('#exploreButton');
        
        if (!oval || !exploreButton) return;
        
        if (oval.classList.contains('toggled')) {
            oval.classList.remove('toggled');
            exploreButton.classList.add('hidden');
        } else {
            // Collapse any previously expanded section
            sections.forEach(sec => {
                const otherOval = sec.querySelector('.oval');
                const otherExploreButton = sec.querySelector('#exploreButton');
                if (otherOval && otherOval.classList.contains('toggled')) {
                    otherOval.classList.remove('toggled');
                    otherExploreButton.classList.add('hidden');
                }
            });

            // Expand the clicked section
            oval.classList.add('toggled');
            exploreButton.classList.remove('hidden');
        }
        
        // Class sync for magnifying glass
        const isToggled = oval.classList.contains('toggled');
        
        glassInstances.forEach(inst => {
            const cachedSections = inst.cachedBodyClone.querySelectorAll('.toggleClipSection');
            const currentSection = Array.from(sections).indexOf(section);
            
            if (cachedSections[currentSection]) {
                const cachedOval = cachedSections[currentSection].querySelector('.oval');
                const cachedButton = cachedSections[currentSection].querySelector('#exploreButton');
                
                if (cachedOval && cachedButton) {
                    if (isToggled) {
                        cachedOval.classList.add('toggled');
                        cachedButton.classList.remove('hidden');
                    } else {
                        cachedOval.classList.remove('toggled');
                        cachedButton.classList.add('hidden');
                    }
                    
                    cachedSections.forEach((cachedSec, idx) => {
                        if (idx !== currentSection) {
                            const otherOval = cachedSec.querySelector('.oval');
                            const otherButton = cachedSec.querySelector('#exploreButton');
                            if (otherOval) otherOval.classList.remove('toggled');
                            if (otherButton) otherButton.classList.add('hidden');
                        }
                    });
                }
            }
            
            inst.lastRenderKey = null;
            inst.render();
        });
        
        // Animation tracking
        let sampleCount = 0;
        const maxSamples = 30;
        
        const syncedSample = () => {
            if (sampleCount < maxSamples) {
                sampleCount++;
                
                glassInstances.forEach(inst => {
                    const realOval = section.querySelector('.oval');
                    const cachedSections = inst.cachedBodyClone.querySelectorAll('.toggleClipSection');
                    const cachedOval = cachedSections[index]?.querySelector('.oval');
                    
                    if (realOval && cachedOval) {
                        const computed = window.getComputedStyle(realOval);
                        
                        if (computed.clipPath && computed.clipPath !== 'none') {
                            cachedOval.style.clipPath = computed.clipPath;
                        }
                        if (computed.transform && computed.transform !== 'none') {
                            cachedOval.style.transform = computed.transform;
                        }
                        
                        const safeProperties = ['opacity'];
                        safeProperties.forEach(prop => {
                            if (computed[prop] && computed[prop] !== 'none' && computed[prop] !== 'auto') {
                                cachedOval.style[prop] = computed[prop];
                            }
                        });
                    }
                    
                    inst.lastRenderKey = null;
                    inst.render();
                });
                
                setTimeout(syncedSample, 16);
            }
        };
        
        setTimeout(syncedSample, 10);
    });
});

// MAGNIFYING GLASS CLASS
let glassInstances = [];
let scrollTimeout = null;
let resizeTimeout = null;

class MagnifyingGlass {
    constructor(element) {
        console.log('Creating MagnifyingGlass instance in Safari'); // Debug
        
        this.element = element;
        this.glassContent = element.querySelector('.glass-header-content');
        this.currentZoom = 1.05;
        this.edgeThicknessRatio = 0.48;
        this.numLayers = 10;
        this.cachedBodyClone = null;
        this.lastRenderKey = null;
        this.lastScrollY = window.scrollY;
        this.layers = [];
        
        if (!this.glassContent) {
            console.error('No .glass-header-content found!');
            return;
        }
        
        this.createStaticCache();
        this.render();
    }

    createStaticCache() {
        this.cachedBodyClone = document.body.cloneNode(true);
        
        this.cachedBodyClone.querySelectorAll('.magnifying-glass').forEach(el => {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
        });
        
        this.cachedBodyClone.querySelectorAll('.header-ui').forEach(el => {
            el.style.display = 'none'; 
            el.style.visibility = 'hidden';
        });
        
        // Safari performance: Remove heavy effects
        this.cachedBodyClone.querySelectorAll('*').forEach(el => {
            el.style.boxShadow = 'none';
            el.style.textShadow = 'none';
            el.style.filter = 'none';
            el.style.backdropFilter = 'none';
        });
    }

    updateLayerPositions() {
        const scrollDiff = window.scrollY - this.lastScrollY;
        this.lastScrollY = window.scrollY;
        
        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i];
            if (!layer) continue;
            
            const contentDiv = layer.firstElementChild;
            if (contentDiv && contentDiv.style.transform) {
                const currentTransform = contentDiv.style.transform;
                const match = currentTransform.match(/translate3d\(([^,]+),\s*([^,]+),\s*([^)]+)\)/);
                if (match) {
                    const x = parseFloat(match[1]);
                    const y = parseFloat(match[2]) - scrollDiff;
                    contentDiv.style.transform = currentTransform.replace(
                        /translate3d\([^)]+\)/,
                        `translate3d(${x}px, ${y}px, 0)`
                    );
                }
            }
        }
    }

    render() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        this.animationFrameId = requestAnimationFrame(() => {
            const glassRect = this.element.getBoundingClientRect();
            if (glassRect.width === 0) return;

            const renderKey = `${this.currentZoom}-${this.edgeThicknessRatio}-${this.numLayers}-${Math.round(glassRect.width/10)*10}-${Math.round(glassRect.height/10)*10}`;
            const scrollDiff = Math.abs(window.scrollY - this.lastScrollY);
            
            if (this.lastRenderKey === renderKey && scrollDiff < 300) {
                this.updateLayerPositions();
                return;
            }
            
            this.lastRenderKey = renderKey;
            this.lastScrollY = window.scrollY;
            
            this.fullRender(glassRect);
        });
    }

    fullRender(glassRect) {
        if (!this.cachedBodyClone || !this.glassContent) return;
        
        this.glassContent.innerHTML = '';
        this.layers = [];
        
        const w = glassRect.width;
        const h = glassRect.height;
        const totalThickness = Math.min(w, h) * this.edgeThicknessRatio;
        
        const createLayer = (scale, mask) => {
            const layerDiv = document.createElement('div');
            layerDiv.style.cssText = `position:absolute;top:0;left:0;width:100%;height:100%;mask-image:${mask};-webkit-mask-image:${mask};mask-size:100% 100%;-webkit-mask-size:100% 100%;transform:translate3d(0,0,0);will-change:transform;`;
            
            const centerX = glassRect.left + w / 2;
            const centerY = glassRect.top + h / 2 + window.scrollY;   
            
            // Safari fix: Adjust for centered header
            const screenCenter = window.innerWidth / 2;
            const headerCenter = glassRect.left + w / 2;
            const centerOffset = screenCenter - headerCenter;
            
           const offsetX = -(centerX * 1.0 - w / 2);
           const offsetY = -(centerY * scale - h / 2);

            const contentDiv = document.createElement('div');
            contentDiv.style.cssText = `position:absolute;left:${offsetX}px;top:${offsetY}px;width:${document.documentElement.scrollWidth}px;height:${document.documentElement.scrollHeight}px;transform:scaleY(${scale}) translate3d(0,0,0);transform-origin:0 0;will-change:transform;`;
            
            contentDiv.appendChild(this.cachedBodyClone.cloneNode(true));
            layerDiv.appendChild(contentDiv);
            this.glassContent.appendChild(layerDiv);
            this.layers.push(layerDiv);
        };
        
        const createPath = (rect) => `M${rect.x},${rect.y} H${rect.x + rect.w} V${rect.y + rect.h - rect.ry} A${rect.rx},${rect.ry} 0 0 1 ${rect.x + rect.w - rect.rx},${rect.y + rect.h} H${rect.x + rect.rx} A${rect.rx},${rect.ry} 0 0 1 ${rect.x},${rect.y + rect.h - rect.ry} Z`;
        const getRadius = (currentW, currentH, thickness) => ({ rx: Math.max(0, 20 - thickness), ry: Math.max(0, 20 - thickness) });

        // Center layer
        const centerW = w - totalThickness * 2;
        const centerH = h - totalThickness * 2;
        const centerRadii = getRadius(centerW, centerH, totalThickness);
        const centerRect = { x: totalThickness, y: totalThickness, w: centerW, h: centerH, ...centerRadii };
        const centerPath = createPath(centerRect);
        const centerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><path d="${centerPath}" fill="white"/></svg>`;
        createLayer(this.currentZoom, `url("data:image/svg+xml;base64,${btoa(centerSvg)}")`);

        // Edge layers
        for (let i = 0; i < this.numLayers; i++) {
            const progress = i / (this.numLayers - 1);
            const scale = this.currentZoom + (Math.pow(progress, 2.5) * 0.9);
            const outerThick = totalThickness * (1 - (i / this.numLayers));
            const innerThick = (i === this.numLayers - 1) ? 0 : totalThickness * (1 - (i + 1) / this.numLayers) - 0.5;
            const outerW = w - outerThick * 2;
            const outerH = h - outerThick * 2;
            const innerW = w - innerThick * 2;
            const innerH = h - innerThick * 2;
            const outerRadii = getRadius(outerW, outerH, outerThick);
            const innerRadii = getRadius(innerW, innerH, innerThick);
            const outer = { x: outerThick, y: outerThick, w: outerW, h: outerH, ...outerRadii };
            const inner = { x: innerThick, y: innerThick, w: innerW, h: innerH, ...innerRadii };
            const framePath = `${createPath(outer)} ${createPath(inner)}`;
            const frameSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><path d="${framePath}" fill-rule="evenodd" fill="white"/></svg>`;
            createLayer(scale, `url("data:image/svg+xml;base64,${btoa(frameSvg)}")`);
        }
        
        console.log(`Safari: Created ${this.layers.length} layers`); // Debug
    }

    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.cachedBodyClone = null;
        this.layers = [];
    }
}

// Event listeners
window.addEventListener('resize', () => {
    if (resizeTimeout) return;
    resizeTimeout = setTimeout(() => {
        glassInstances.forEach(inst => {
            inst.lastRenderKey = null;
            inst.render();
        });
        resizeTimeout = null;
    }, 100);
});

// Safari-specific loading with delay
window.addEventListener('load', () => {
    console.log('Safari: Page loaded, initializing magnifying glass');
    
    // Safari delay fix
    setTimeout(() => {
        document.querySelectorAll('.magnifying-glass').forEach(el => {
            console.log('Safari: Found magnifying glass element', el);
            glassInstances.push(new MagnifyingGlass(el));
        });
        console.log(`Safari: Created ${glassInstances.length} instances`);
    }, 200); // 200ms delay for Safari
});

window.addEventListener('scroll', () => {
    if (scrollTimeout) return;
    scrollTimeout = setTimeout(() => {
        glassInstances.forEach(inst => inst.render());
        scrollTimeout = null;
    }, 16);
}, { passive: true });

window.addEventListener('beforeunload', () => {
    glassInstances.forEach(instance => instance.destroy());
    glassInstances = [];
});