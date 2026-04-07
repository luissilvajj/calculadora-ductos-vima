let piecesList = [];
const INCH_TO_METER = 0.0254;

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('duct-form');
    
    // Category Selectors
    const categoryRadios = document.querySelectorAll('input[name="pieceCategory"]');
    const shapeOptionsContainer = document.getElementById('shape-options');
    
    // Dimension Sections
    const secondaryDimensions = document.getElementById('secondary-dimensions');
    const curveParameters = document.getElementById('curve-parameters');
    const lengthParameter = document.getElementById('length-parameter');
    
    // Input Fields Boca 1
    const fgWidth1 = document.getElementById('fg-width1');
    const fgHeight1 = document.getElementById('fg-height1');
    const fgDiameter1 = document.getElementById('fg-diameter1');
    const w1Input = document.getElementById('width1');
    const h1Input = document.getElementById('height1');
    const d1Input = document.getElementById('diameter1');
    
    // Input Fields Boca 2
    const fgWidth2 = document.getElementById('fg-width2');
    const fgHeight2 = document.getElementById('fg-height2');
    const fgDiameter2 = document.getElementById('fg-diameter2');
    const w2Input = document.getElementById('width2');
    const h2Input = document.getElementById('height2');
    const d2Input = document.getElementById('diameter2');

    // Curve and general parameters
    const lengthInput = document.getElementById('length');
    const length2Input = document.getElementById('length2');
    const length2Parameter = document.getElementById('length2-parameter');
    const yeeParameters = document.getElementById('yee-parameters');
    const angleInput = document.getElementById('angle');
    const innerRadiusInput = document.getElementById('inner-radius');
    const gaugeSelect = document.getElementById('gauge');
    const wasteInput = document.getElementById('waste');
    const pieceNameInput = document.getElementById('piece-name');
    const pieceZonaInput = document.getElementById('piece-zona');
    const pieceSubzonaInput = document.getElementById('piece-subzona');
    const pieceQtyInput = document.getElementById('piece-qty');
    const pieceObsInput = document.getElementById('piece-obs');
    const zonaDatalist = document.getElementById('zona-list');
    const subzonaDatalist = document.getElementById('subzona-list');
    const clearListBtn = document.getElementById('clear-list');
    const costKgInput = document.getElementById('cost-per-kg');

    // Totals Elements
    const globalArea = document.getElementById('global-area');
    const globalTotal = document.getElementById('global-total');
    const globalCost = document.getElementById('global-cost');

    const fabCard = document.getElementById('fabrication-summary-card');
    const fabList = document.getElementById('fabrication-list');

    // Generar opciones de Forma según la categoría
    function buildShapeOptions(category) {
        let html = '';
        if (category === 'tramo' || category === 'codo') {
            html = `
                <label class="radio-card">
                    <input type="radio" name="shape" value="rectangular" checked>
                    <div class="card-content"><span>Rectangular</span></div>
                </label>
                <label class="radio-card">
                    <input type="radio" name="shape" value="circular">
                    <div class="card-content"><span>Circular</span></div>
                </label>
            `;
        } else if (category === 'reductor') {
            html = `
                <label class="radio-card">
                    <input type="radio" name="shape" value="rect-rect" checked>
                    <div class="card-content"><span>Rect-Rect</span></div>
                </label>
                <label class="radio-card">
                    <input type="radio" name="shape" value="circ-circ">
                    <div class="card-content"><span>Cono Circular</span></div>
                </label>
                <label class="radio-card">
                    <input type="radio" name="shape" value="pantalon">
                    <div class="card-content"><span>Cuadrado a Redondo</span></div>
                </label>
            `;
        } else if (category === 'accesorio') {
            html = `
                <label class="radio-card"><input type="radio" name="shape" value="bota" checked><div class="card-content"><span>Bota</span></div></label>
                <label class="radio-card"><input type="radio" name="shape" value="tee-rect"><div class="card-content"><span>Tee Rect</span></div></label>
                <label class="radio-card"><input type="radio" name="shape" value="tee-circ"><div class="card-content"><span>Tee Circ</span></div></label>
                <label class="radio-card"><input type="radio" name="shape" value="yee-rect"><div class="card-content"><span>Yee Rect</span></div></label>
                <label class="radio-card"><input type="radio" name="shape" value="yee-circ"><div class="card-content"><span>Yee Circ</span></div></label>
                <label class="radio-card"><input type="radio" name="shape" value="mariposa-rect"><div class="card-content"><span>Mariposa R</span></div></label>
                <label class="radio-card"><input type="radio" name="shape" value="mariposa-circ"><div class="card-content"><span>Mariposa C</span></div></label>
                <label class="radio-card"><input type="radio" name="shape" value="tapa-rect"><div class="card-content"><span>Tapa Rect</span></div></label>
                <label class="radio-card"><input type="radio" name="shape" value="tapa-circ"><div class="card-content"><span>Tapa Circ</span></div></label>
            `;
        }
        shapeOptionsContainer.innerHTML = html;
        
        // Re-attach listeners for shape changes
        const shapeRadios = document.querySelectorAll('input[name="shape"]');
        shapeRadios.forEach(r => r.addEventListener('change', updateFormUI));
    }

    function updateFormUI() {
        const category = document.querySelector('input[name="pieceCategory"]:checked').value;
        const shape = document.querySelector('input[name="shape"]:checked')?.value;

        // Reset display
        secondaryDimensions.style.display = 'none';
        curveParameters.style.display = 'none';
        lengthParameter.style.display = 'flex';
        length2Parameter.style.display = 'none';
        yeeParameters.style.display = 'none';
        
        fgWidth1.style.display = 'none'; fgHeight1.style.display = 'none'; fgDiameter1.style.display = 'none';
        fgWidth2.style.display = 'none'; fgHeight2.style.display = 'none'; fgDiameter2.style.display = 'none';

        // Set Requirements to false to prevent hidden validation errors
        [w1Input, h1Input, d1Input, w2Input, h2Input, d2Input, lengthInput, innerRadiusInput].forEach(el => el.required = false);

        if (category === 'tramo') {
            wasteInput.value = "10"; // Automatic waste for straight ducts
            lengthInput.required = true;
            if (shape === 'rectangular') {
                fgWidth1.style.display = 'block'; fgHeight1.style.display = 'block';
                w1Input.required = true; h1Input.required = true;
            } else {
                fgDiameter1.style.display = 'block';
                d1Input.required = true;
            }
        } 
        else if (category === 'codo') {
            wasteInput.value = "30"; // Automatic high waste for elbows
            lengthParameter.style.display = 'none';
            curveParameters.style.display = 'block';
            innerRadiusInput.required = true;
            if (shape === 'rectangular') {
                fgWidth1.style.display = 'block'; fgHeight1.style.display = 'block';
                w1Input.required = true; h1Input.required = true;
            } else {
                fgDiameter1.style.display = 'block';
                d1Input.required = true;
            }
        }
        else if (category === 'reductor') {
            wasteInput.value = "20"; // Automatic moderate waste for reducers
            secondaryDimensions.style.display = 'block';
            lengthInput.required = true;
            if (shape === 'rect-rect') {
                fgWidth1.style.display = 'block'; fgHeight1.style.display = 'block';
                fgWidth2.style.display = 'block'; fgHeight2.style.display = 'block';
                w1Input.required = true; h1Input.required = true;
                w2Input.required = true; h2Input.required = true;
            } else if (shape === 'circ-circ') {
                fgDiameter1.style.display = 'block';
                fgDiameter2.style.display = 'block';
                d1Input.required = true; d2Input.required = true;
            } else if (shape === 'pantalon') {
                fgWidth1.style.display = 'block'; fgHeight1.style.display = 'block';
                fgDiameter2.style.display = 'block';
                w1Input.required = true; h1Input.required = true;
                d2Input.required = true;
            }
        }
        else if (category === 'accesorio') {
            if (shape === 'bota') {
                wasteInput.value = "20";
                fgWidth1.style.display = 'block'; fgHeight1.style.display = 'block';
                secondaryDimensions.style.display = 'block';
                fgDiameter2.style.display = 'block';
                lengthParameter.style.display = 'flex';
                w1Input.required = true; h1Input.required = true;
                d2Input.required = true; lengthInput.required = true;
            } else if (shape === 'tee-rect') {
                wasteInput.value = "25";
                fgWidth1.style.display = 'block'; fgHeight1.style.display = 'block';
                secondaryDimensions.style.display = 'block';
                fgWidth2.style.display = 'block'; fgHeight2.style.display = 'block';
                lengthParameter.style.display = 'flex';
                length2Parameter.style.display = 'flex';
                w1Input.required = true; h1Input.required = true;
                w2Input.required = true; h2Input.required = true;
                lengthInput.required = true; length2Input.required = true;
            } else if (shape === 'tee-circ') {
                wasteInput.value = "25";
                fgDiameter1.style.display = 'block';
                secondaryDimensions.style.display = 'block';
                fgDiameter2.style.display = 'block';
                lengthParameter.style.display = 'flex';
                length2Parameter.style.display = 'flex';
                d1Input.required = true; d2Input.required = true;
                lengthInput.required = true; length2Input.required = true;
            } else if (shape === 'yee-rect') {
                wasteInput.value = "25";
                fgWidth1.style.display = 'block'; fgHeight1.style.display = 'block';
                secondaryDimensions.style.display = 'block';
                fgWidth2.style.display = 'block'; fgHeight2.style.display = 'block';
                lengthParameter.style.display = 'flex';
                length2Parameter.style.display = 'flex';
                yeeParameters.style.display = 'block';
                w1Input.required = true; h1Input.required = true;
                w2Input.required = true; h2Input.required = true;
                lengthInput.required = true; length2Input.required = true;
            } else if (shape === 'yee-circ') {
                wasteInput.value = "25";
                fgDiameter1.style.display = 'block';
                secondaryDimensions.style.display = 'block';
                fgDiameter2.style.display = 'block';
                lengthParameter.style.display = 'flex';
                length2Parameter.style.display = 'flex';
                yeeParameters.style.display = 'block';
                d1Input.required = true; d2Input.required = true;
                lengthInput.required = true; length2Input.required = true;
            } else if (shape === 'mariposa-rect') {
                wasteInput.value = "30";
                fgWidth1.style.display = 'block'; fgHeight1.style.display = 'block';
                curveParameters.style.display = 'block';
                lengthParameter.style.display = 'none';
                w1Input.required = true; h1Input.required = true;
                innerRadiusInput.required = true;
            } else if (shape === 'mariposa-circ') {
                wasteInput.value = "30";
                fgDiameter1.style.display = 'block';
                curveParameters.style.display = 'block';
                lengthParameter.style.display = 'none';
                d1Input.required = true;
                innerRadiusInput.required = true;
            } else if (shape === 'tapa-rect') {
                wasteInput.value = "10";
                fgWidth1.style.display = 'block'; fgHeight1.style.display = 'block';
                lengthParameter.style.display = 'none';
                w1Input.required = true; h1Input.required = true;
            } else if (shape === 'tapa-circ') {
                wasteInput.value = "10";
                fgDiameter1.style.display = 'block';
                lengthParameter.style.display = 'none';
                d1Input.required = true;
            }
        }
    }

    // Attach Category listeners
    categoryRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            buildShapeOptions(e.target.value);
            updateFormUI();
        });
    });

    // Initialize UI
    buildShapeOptions('tramo');
    updateFormUI();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const category = document.querySelector('input[name="pieceCategory"]:checked').value;
        const shape = document.querySelector('input[name="shape"]:checked').value;
        const length = parseFloat(lengthInput.value || 0); // En metros
        let area = 0;
        let dimText = "";
        let shapeName = "";

        // Lectura de inputs en pulgadas
        const w1 = parseFloat(w1Input.value || 0);
        const h1 = parseFloat(h1Input.value || 0);
        const d1 = parseFloat(d1Input.value || 0);
        const w2 = parseFloat(w2Input.value || 0);
        const h2 = parseFloat(h2Input.value || 0);
        const d2 = parseFloat(d2Input.value || 0);
        const R_interno = parseFloat(innerRadiusInput.value || 0);
        const angle = parseFloat(angleInput.value || 90);

        // Geometría Computacional (Áreas Superficiales)
        if (category === 'tramo') {
            if (shape === 'rectangular') {
                area = 2 * ((w1 + h1) * INCH_TO_METER) * length;
                shapeName = "Rect"; dimText = `${w1}"x${h1}"`;
            } else {
                area = Math.PI * (d1 * INCH_TO_METER) * length;
                shapeName = "Circ"; dimText = `Ø${d1}"`;
            }
        } 
        else if (category === 'codo') {
            const angleFactor = angle / 360;
            // Para codos, R_interno esta en pulgadas, lo pasamos a metros
            const ri_m = R_interno * INCH_TO_METER;
            
            if (shape === 'rectangular') {
                const w_m = w1 * INCH_TO_METER;
                const h_m = h1 * INCH_TO_METER;
                const re_m = ri_m + w_m; // Radio Exterior
                
                // Área Cara Superior + Cara Inferior (Mejillas)
                const areaMejillas = 2 * ( (Math.PI * angleFactor * Math.pow(re_m, 2)) - (Math.PI * angleFactor * Math.pow(ri_m, 2)) );
                // Área Lomo (Heel)
                const areaLomo = h_m * (2 * Math.PI * angleFactor * re_m);
                // Área Garganta (Throat)
                const areaGarganta = h_m * (2 * Math.PI * angleFactor * ri_m);
                
                area = areaMejillas + areaLomo + areaGarganta;
                shapeName = `Codo Rect ${angle}°`; dimText = `${w1}"x${h1}" R.int:${R_interno}"`;
            } else {
                const d_m = d1 * INCH_TO_METER;
                const r_centro_m = ri_m + (d_m / 2); // Centerline radius
                // Superficie = Perimetro_seccion * Longitud_arco_central
                const perimetro = Math.PI * d_m;
                const arco = 2 * Math.PI * r_centro_m * angleFactor;
                area = perimetro * arco;
                
                shapeName = `Codo Circ ${angle}°`; dimText = `Ø${d1}" R.int:${R_interno}"`;
            }
        }
        else if (category === 'reductor') {
            if (shape === 'rect-rect') {
                const p1_m = 2 * (w1 + h1) * INCH_TO_METER;
                const p2_m = 2 * (w2 + h2) * INCH_TO_METER;
                area = ((p1_m + p2_m) / 2) * length;
                shapeName = "Reducción Rect"; dimText = `${w1}"x${h1}" a ${w2}"x${h2}"`;
            } else if (shape === 'circ-circ') {
                const p1_m = Math.PI * d1 * INCH_TO_METER;
                const p2_m = Math.PI * d2 * INCH_TO_METER;
                area = ((p1_m + p2_m) / 2) * length;
                shapeName = "Cono Circ"; dimText = `Ø${d1}" a Ø${d2}"`;
            } else if (shape === 'pantalon') {
                const p1_m = 2 * (w1 + h1) * INCH_TO_METER;
                const p2_m = Math.PI * d2 * INCH_TO_METER;
                area = ((p1_m + p2_m) / 2) * length;
                shapeName = "Transic. C/R"; dimText = `${w1}"x${h1}" a Ø${d2}"`;
            }
        }
        else if (category === 'accesorio') {
            const length2 = parseFloat(length2Input.value || 0);
            const yeeAngle = parseFloat(document.getElementById('yee-angle')?.value || 45);

            if (shape === 'bota') {
                const p1_m = 2 * (w1 + h1) * INCH_TO_METER;
                const p2_m = Math.PI * d2 * INCH_TO_METER;
                area = ((p1_m + p2_m) / 2) * length;
                shapeName = "Bota"; dimText = `${w1}"x${h1}" → Ø${d2}"`;
            } else if (shape === 'tee-rect') {
                const pMain = 2 * (w1 + h1) * INCH_TO_METER;
                const pBranch = 2 * (w2 + h2) * INCH_TO_METER;
                area = (pMain * length) + (pBranch * length2);
                shapeName = "Tee Rect"; dimText = `${w1}"x${h1}" | R:${w2}"x${h2}"`;
            } else if (shape === 'tee-circ') {
                const pMain = Math.PI * d1 * INCH_TO_METER;
                const pBranch = Math.PI * d2 * INCH_TO_METER;
                area = (pMain * length) + (pBranch * length2);
                shapeName = "Tee Circ"; dimText = `Ø${d1}" | R:Ø${d2}"`;
            } else if (shape === 'yee-rect') {
                const angleRad = (yeeAngle * Math.PI) / 180;
                const pMain = 2 * (w1 + h1) * INCH_TO_METER;
                const pBranch = 2 * (w2 + h2) * INCH_TO_METER;
                // Branch arm needs more material along the miter cut
                area = (pMain * length) + (pBranch * length2 / Math.cos(angleRad));
                shapeName = `Yee ${yeeAngle}° Rect`; dimText = `${w1}"x${h1}" | R:${w2}"x${h2}"`;
            } else if (shape === 'yee-circ') {
                const angleRad = (yeeAngle * Math.PI) / 180;
                const pMain = Math.PI * d1 * INCH_TO_METER;
                const pBranch = Math.PI * d2 * INCH_TO_METER;
                area = (pMain * length) + (pBranch * length2 / Math.cos(angleRad));
                shapeName = `Yee ${yeeAngle}° Circ`; dimText = `Ø${d1}" | R:Ø${d2}"`;
            } else if (shape === 'mariposa-rect') {
                // Mariposa = 2 codos de 90° consecutivos (S-curve)
                const ri_m = R_interno * INCH_TO_METER;
                const w_m = w1 * INCH_TO_METER;
                const h_m = h1 * INCH_TO_METER;
                const re_m = ri_m + w_m;
                const af = 90 / 360;
                const mejillas = 2 * (Math.PI * af * re_m**2 - Math.PI * af * ri_m**2);
                const oneCodo = mejillas + h_m * (2 * Math.PI * af * re_m) + h_m * (2 * Math.PI * af * ri_m);
                area = 2 * oneCodo;
                shapeName = "Mariposa Rect"; dimText = `${w1}"x${h1}" R:${R_interno}"`;
            } else if (shape === 'mariposa-circ') {
                const ri_m = R_interno * INCH_TO_METER;
                const d_m = d1 * INCH_TO_METER;
                const r_c = ri_m + d_m / 2;
                const oneCodo = (Math.PI * d_m) * (2 * Math.PI * r_c * 0.25);
                area = 2 * oneCodo;
                shapeName = "Mariposa Circ"; dimText = `Ø${d1}" R:${R_interno}"`;
            } else if (shape === 'tapa-rect') {
                const w_m = w1 * INCH_TO_METER;
                const h_m = h1 * INCH_TO_METER;
                const flange = 0.038; // 1.5" flange
                area = (w_m * h_m) + (2 * w_m + 2 * h_m) * flange;
                shapeName = "Tapa Rect"; dimText = `${w1}"x${h1}"`;
            } else if (shape === 'tapa-circ') {
                const r_m = (d1 * INCH_TO_METER) / 2;
                const flange = 0.038;
                area = Math.PI * r_m**2 + 2 * Math.PI * r_m * flange;
                shapeName = "Tapa Circ"; dimText = `Ø${d1}"`;
            }
        }

        // Si área es irracional o falló
        if (isNaN(area) || area <= 0) return;

        // Peso Calculation
        const gaugeOption = gaugeSelect.options[gaugeSelect.selectedIndex];
        const weightPerSqMeter = parseFloat(gaugeOption.value);
        const wastePercent = parseFloat(wasteInput.value) || 0;

        const netWeight = area * weightPerSqMeter;
        const wasteWeight = netWeight * (wastePercent / 100);
        const totalWeight = netWeight + wasteWeight;

        let pieceDescription = pieceNameInput.value.trim();
        if (!pieceDescription) pieceDescription = category === 'tramo' ? 'Tramo' : category === 'codo' ? 'Codo' : 'Reducción';

        const pieceZona = pieceZonaInput.value.trim() || 'Sin Zona';
        const pieceSubzona = pieceSubzonaInput.value.trim() || 'General';
        const pieceQty = parseInt(pieceQtyInput.value) || 1;
        const pieceObs = pieceObsInput.value.trim();

        // Determine lengthOrRadius display for PDF table
        let lengthOrRadiusDisplay;
        if (category === 'codo') {
            lengthOrRadiusDisplay = R_interno ? `${R_interno}" r.int` : '-';
        } else if (category === 'accesorio' && ['mariposa-rect', 'mariposa-circ', 'tapa-rect', 'tapa-circ'].includes(shape)) {
            lengthOrRadiusDisplay = R_interno > 0 ? `${R_interno}" r.int` : '-';
        } else {
            lengthOrRadiusDisplay = length > 0 ? `${length.toFixed(2)} m` : '-';
        }

        // Breakdown for Tramos (Standard 1.20m sheet)
        let breakdown = "";
        if (category === 'tramo' && length > 0) {
            const numFull = Math.floor(length / 1.2);
            const remainder = +(length % 1.2).toFixed(2);
            
            if (numFull > 0 && remainder > 0) {
                breakdown = `${numFull} de 1.20m + 1 de ${remainder.toFixed(2)}m`;
            } else if (numFull > 0) {
                breakdown = `${numFull} de 1.20m`;
            } else {
                breakdown = `1 de ${remainder.toFixed(2)}m`;
            }
        }

        const newPiece = {
            id: Date.now().toString(),
            description: pieceDescription,
            category: category,
            shapeName: shapeName,
            dimensions: dimText,
            gauge: gaugeOption.dataset.name,
            length: length,
            area: area,
            netWeight: netWeight,
            wasteWeight: wasteWeight,
            totalWeight: totalWeight,
            breakdown: breakdown,
            zona: pieceZona,
            subzona: pieceSubzona,
            qty: pieceQty,
            obs: pieceObs,
            lengthOrRadius: lengthOrRadiusDisplay
        };

        piecesList.push(newPiece);
        renderTable();
        updateDatalistsUI();

        // Clear qty and obs for quick sequential entry
        pieceQtyInput.value = '1';
        pieceObsInput.value = '';
    });

    function updateDatalistsUI() {
        const zonas = [...new Set(piecesList.map(p => p.zona).filter(z => z !== 'Sin Zona'))];
        const subzonas = [...new Set(piecesList.map(p => p.subzona).filter(s => s !== 'General'))];
        zonaDatalist.innerHTML = zonas.map(z => `<option value="${z}">`).join('');
        subzonaDatalist.innerHTML = subzonas.map(s => `<option value="${s}">`).join('');
    }

    document.getElementById('clear-list').addEventListener('click', () => {
        if(piecesList.length > 0 && confirm("¿Borrar todo el historial de la cotización?")) {
            piecesList = [];
            renderTable();
        }
    });

    const piecesTbody = document.getElementById('pieces-tbody');
    const emptyState = document.getElementById('empty-state');
    const tableFooter = document.getElementById('table-footer');

    function renderTable() {
        // Clear all rows except empty state
        const rows = piecesTbody.querySelectorAll('tr:not(#empty-state)');
        rows.forEach(row => row.remove());

        if (piecesList.length === 0) {
            emptyState.style.display = 'table-row';
            fabCard.style.display = 'none';
            tableFooter.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            fabCard.style.display = 'block';
            tableFooter.style.display = 'table-footer-group';
            
            piecesList.forEach(piece => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <strong style="display:block;">${piece.description}</strong>
                        <span style="font-size:0.75rem; color:var(--secondary)">${piece.shapeName}</span>
                        ${piece.breakdown ? `<div style="margin-top:4px; font-size:0.75rem; color:var(--primary); font-weight:600;"><i class="ri-scissors-cut-line"></i> ${piece.breakdown}</div>` : ''}
                    </td>
                    <td>${piece.dimensions}</td>
                    <td><span class="badge">Cal ${piece.gauge}</span></td>
                    <td>${piece.area.toFixed(2)}</td>
                    <td>
                        <strong style="color:var(--text-main); font-size:1.05rem;">${piece.totalWeight.toFixed(2)} kg</strong>
                    </td>
                    <td style="text-align:right;">
                        <button class="btn-icon delete-btn" data-id="${piece.id}" title="Eliminar">
                            <i class="ri-delete-bin-line"></i>
                        </button>
                    </td>
                `;
                piecesTbody.appendChild(tr);
            });

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idToRemove = e.currentTarget.dataset.id;
                    piecesList = piecesList.filter(p => p.id !== idToRemove);
                    renderTable();
                });
            });
        }
        updateTotals();
    }

    function updateTotals() {
        const costPerKg = parseFloat(costKgInput.value) || 0;
        
        const sums = piecesList.reduce((acc, piece) => {
            acc.area += piece.area; 
            acc.total += piece.totalWeight;
            
            // Count for fab summary
            if (piece.category === 'tramo') {
                const numFull = Math.floor(piece.length / 1.2);
                const rem = piece.length % 1.2;
                acc.counts.fullTramos += numFull;
                if (rem > 0.01) acc.counts.specialTramos++;
            } else if (piece.category === 'codo') {
                acc.counts.codos++;
            } else if (piece.category === 'reductor') {
                acc.counts.reductores++;
            }
            
            return acc;
        }, { area: 0, total: 0, counts: { fullTramos: 0, specialTramos: 0, codos: 0, reductores: 0 } });

        const totalCost = sums.total * costPerKg;
        const formattedPrice = `$ ${totalCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

        document.getElementById('global-area').innerHTML = `${sums.area.toFixed(2)} <small>m²</small>`;
        document.getElementById('global-total').innerHTML = `${sums.total.toFixed(2)} <small>kg</small>`;
        document.getElementById('global-cost').innerHTML = formattedPrice;

        // Footer Totals
        document.getElementById('foot-area').innerText = sums.area.toFixed(2);
        document.getElementById('foot-total-weight').innerText = `${sums.total.toFixed(2)} kg`;
        document.getElementById('foot-total-price').innerText = formattedPrice;

        // Update Fab Summary List
        fabList.innerHTML = '';
        if (sums.counts.fullTramos > 0) {
            addFabSummaryItem("Tramos de 1.20m", sums.counts.fullTramos);
        }
        if (sums.counts.specialTramos > 0) {
            addFabSummaryItem("Tramos Medida Especial", sums.counts.specialTramos);
        }
        if (sums.counts.codos > 0) {
            addFabSummaryItem("Codos Totales", sums.counts.codos);
        }
        if (sums.counts.reductores > 0) {
            addFabSummaryItem("Reducciones / Transiciones", sums.counts.reductores);
        }
    }

    function addFabSummaryItem(label, value) {
        const div = document.createElement('div');
        div.className = 'fab-item';
        div.innerHTML = `
            <span class="fab-label">${label}</span>
            <span class="fab-value">${value} Piezas</span>
        `;
        fabList.appendChild(div);
    }

    costKgInput.addEventListener('input', updateTotals);

    // =====================
    // PDF EXPORT FUNCTION
    // =====================
    document.getElementById('export-pdf').addEventListener('click', () => {
        if (piecesList.length === 0) { alert('Agrega piezas antes de exportar.'); return; }
        buildPrintView();
        window.print();
    });

    function buildPrintView() {
        const costPerKg = parseFloat(costKgInput.value) || 0;
        const totalKg = piecesList.reduce((s, p) => s + p.totalWeight, 0);
        const totalCost = totalKg * costPerKg;

        document.getElementById('print-meta').textContent =
            `Generado: ${new Date().toLocaleDateString('es-VE', {day:'2-digit',month:'long',year:'numeric'})}`;
        document.getElementById('print-total-kg').textContent = totalKg.toFixed(2);
        document.getElementById('print-total-cost').textContent =
            `$ ${totalCost.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;

        // Group by Zona > Subzona
        const zonaMap = {};
        piecesList.forEach(piece => {
            if (!zonaMap[piece.zona]) zonaMap[piece.zona] = {};
            if (!zonaMap[piece.zona][piece.subzona]) zonaMap[piece.zona][piece.subzona] = [];
            zonaMap[piece.zona][piece.subzona].push(piece);
        });

        let html = '';
        for (const zona in zonaMap) {
            // Zona block weight
            const zonaWeight = Object.values(zonaMap[zona]).flat().reduce((s, p) => s + p.totalWeight, 0);
            html += `
                <div class="print-zona-block">
                    <div class="print-zona-header">${zona}</div>`;

            for (const subzona in zonaMap[zona]) {
                const pieces = zonaMap[zona][subzona];
                html += `
                    <div class="print-subzona-title">${subzona}</div>
                    <table class="print-table">
                        <thead>
                            <tr>
                                <th>Tipo de Pieza</th>
                                <th>Medidas</th>
                                <th>Longitud / Radio</th>
                                <th>Cantidad</th>
                                <th>Observaciones</th>
                            </tr>
                        </thead>
                        <tbody>`;
                pieces.forEach(p => {
                    html += `
                            <tr>
                                <td>${p.description}</td>
                                <td>${p.dimensions}</td>
                                <td>${p.lengthOrRadius}</td>
                                <td style="text-align:center;">${p.qty}</td>
                                <td>${p.obs || ''}</td>
                            </tr>`;
                });
                html += `</tbody></table>`;
            }

            html += `
                    <div class="print-zona-subtotal">Subtotal Zona: ${zonaWeight.toFixed(2)} kg</div>
                </div>`;
        }

        document.getElementById('print-zones-content').innerHTML = html;
    }
});
