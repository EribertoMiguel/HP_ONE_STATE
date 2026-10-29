const steps = [
 ["Identificação","Dados básicos do paciente."],
 ["Queixa e sintomas","Registre a queixa principal e marque os sintomas relatados."],
 ["Avaliação clínica","Documente o estado geral e os achados observados."],
 ["Sinais vitais","Informe as medidas aferidas no cenário."],
 ["Histórico médico","Antecedentes, medicamentos e alergias."],
 ["Classificação e conduta","Registre a prioridade e a decisão médica do RP."],
 ["Ficha final","Revise, baixe ou imprima a ficha."]
];
const catalog = {
 "Respiratórios":["Muita tosse","Tosse seca","Tosse com catarro","Falta de ar","Chiado no peito","Dor ao respirar","Catarro com sangue","Coriza","Nariz entupido","Espirros","Dor de garganta","Rouquidão","Dificuldade para engolir","Respiração acelerada"],
 "Febre e sintomas gerais":["Febre","Calafrios","Suor excessivo","Cansaço","Fraqueza","Mal-estar","Perda de apetite","Perda de peso","Sede excessiva","Sinais de desidratação"],
 "Neurológicos":["Dor de cabeça","Tontura","Vertigem","Desmaio","Confusão","Sonolência","Convulsão","Tremores","Fraqueza em membro","Dormência","Dificuldade para falar","Dificuldade para caminhar","Perda de equilíbrio","Formigamento","Visão turva","Visão dupla","Sensibilidade à luz"],
 "Cardiovasculares":["Dor no peito","Palpitações","Batimentos acelerados","Batimentos irregulares","Inchaço nas pernas","Desmaio ao esforço"],
 "Digestivos":["Náuseas","Vômitos","Diarreia","Prisão de ventre","Dor abdominal","Azia","Refluxo","Gases","Barriga inchada","Sangue nas fezes","Fezes escuras","Perda de apetite"],
 "Urinários":["Dor ao urinar","Ardor ao urinar","Urinar muitas vezes","Sangue na urina","Dificuldade para urinar","Dor lombar","Alteração na cor da urina","Incontinência urinária"],
 "Musculares e articulares":["Dor muscular","Dor nas articulações","Dor nas costas","Dor no pescoço","Inchaço articular","Rigidez","Dificuldade de movimento","Cãibras"],
 "Pele e alergias":["Manchas na pele","Coceira","Vermelhidão","Urticária","Inchaço","Feridas","Bolhas","Descamação","Reação a alimento","Reação a medicamento","Hematomas"],
 "Olhos, ouvidos e boca":["Dor de ouvido","Zumbido","Perda auditiva","Dor nos olhos","Olhos vermelhos","Secreção ocular","Dor de dente","Sangramento gengival","Boca seca"],
 "Saúde emocional e outros":["Ansiedade","Tristeza","Irritabilidade","Alteração do sono","Sangramento","Fadiga","Outros sintomas não listados","Nenhum sintoma adicional informado","Ainda não investigados"]
};
let page = 0;
const selectedSymptoms = new Set();
const $ = id => document.getElementById(id);
function renderCatalog(){
 const host=$("symptomCatalog"); host.innerHTML="";
 Object.entries(catalog).forEach(([category,items])=>{
  const box=document.createElement("div"); box.className="category";
  const h=document.createElement("h3"); h.textContent=category; box.appendChild(h);
  const grid=document.createElement("div"); grid.className="check-grid";
  items.forEach(item=>{
   const label=document.createElement("label"); label.className="choice";
   const input=document.createElement("input"); input.type="checkbox"; input.name="sintomasSelecionados"; input.value=item;
   input.checked=selectedSymptoms.has(item);
   input.addEventListener("change",()=>{
    if(input.checked){
      if(item==="Nenhum sintoma adicional informado"||item==="Ainda não investigados"){
       selectedSymptoms.clear();
       host.querySelectorAll('input[type="checkbox"]').forEach(c=>{if(c!==input)c.checked=false});
      } else {
       selectedSymptoms.delete("Nenhum sintoma adicional informado");
       selectedSymptoms.delete("Ainda não investigados");
       host.querySelectorAll('input[type="checkbox"]').forEach(c=>{if(c.value==="Nenhum sintoma adicional informado"||c.value==="Ainda não investigados")c.checked=false});
      }
      selectedSymptoms.add(item);
    } else selectedSymptoms.delete(item);
   });
   label.append(input,document.createTextNode(item)); grid.appendChild(label);
  });
  box.appendChild(grid); host.appendChild(box);
 });
}
function renderSteps(){
 $("stepList").innerHTML="";
 steps.forEach((s,i)=>{
  const el=document.createElement("div"); el.className="step"+(i===page?" active":i<page?" done":"");
  el.innerHTML=`<span class="num">${i<page?"✓":i+1}</span><span>${s[0]}</span>`;
  el.addEventListener("click",()=>{if(i<=page || i===6){if(i===6 && page<5)return; page=i;renderPage();}});
  $("stepList").appendChild(el);
 });
 $("eyebrow").textContent=`ETAPA ${page+1}`;
 $("stepTitle").textContent=steps[page][0];
 $("stepSub").textContent=steps[page][1];
 $("counter").textContent=`${page+1} de ${steps.length}`;
 document.querySelectorAll(".page").forEach(el=>el.classList.toggle("hidden",Number(el.dataset.page)!==page));
 $("prevBtn").disabled=page===0;
 $("nextBtn").classList.toggle("hidden",page>=5);
 $("navActions").classList.toggle("hidden",page===6);
 if(page===6) buildSummary();
}
function renderPage(){renderSteps();window.scrollTo({top:0,behavior:"smooth"});}
function getData(){
 const data={};
 document.querySelectorAll("#triageForm input, #triageForm select, #triageForm textarea").forEach(el=>{
  if(!el.name || el.name==="sintomasSelecionados")return;
  data[el.name]=el.value.trim();
 });
 data.sintomasSelecionados=Array.from(selectedSymptoms);
 data.tipoDocumento="Simulação de RP — não é prontuário clínico real";
 data.numeroFicha=$("caseNumber").textContent;
 return data;
}
function buildSummary(){
 const d=getData();
 const groups=[
  ["Identificação",["nome","idade","sexo","unidade","profissional"]],
  ["Queixa e sintomas",["queixa","inicioSintomas","localDor","intensidade","inicioDor","outrosSintomas"]],
  ["Avaliação clínica",["consciencia","respiracao","neurologico","exameFisico"]],
  ["Sinais vitais",["pa","fc","fr","temperatura","spo2","glicemia"]],
  ["Histórico médico",["historico","medicamentos","alergias","antecedentes"]],
  ["Classificação e conduta",["prioridade","conduta","observacoes"]]
 ];
 const labels={nome:"Paciente",idade:"Idade",sexo:"Sexo",unidade:"Local",profissional:"Profissional RP",queixa:"Queixa principal",inicioSintomas:"Início dos sintomas",localDor:"Local da dor",intensidade:"Intensidade",inicioDor:"Início da dor",outrosSintomas:"Outros sintomas",consciencia:"Consciência",respiracao:"Respiração",neurologico:"Avaliação neurológica",exameFisico:"Exame físico",pa:"Pressão arterial",fc:"Frequência cardíaca",fr:"Frequência respiratória",temperatura:"Temperatura",spo2:"Saturação O₂",glicemia:"Glicemia",historico:"Antecedentes",medicamentos:"Medicamentos",alergias:"Alergias",antecedentes:"Outras informações",prioridade:"Prioridade RP",conduta:"Conduta",observacoes:"Observações"};
 let html=`<div class="summary-grid">`;
 groups.forEach(([title,keys])=>{
  html+=`<div class="summary-card"><h3>${title}</h3>`;
  keys.forEach(k=>{const val=d[k]||"Não informado";html+=`<p><strong>${labels[k]}:</strong> ${escapeHtml(val)}</p>`});
  if(title==="Queixa e sintomas")html+=`<p><strong>Sintomas selecionados:</strong> ${escapeHtml(d.sintomasSelecionados.join(", ")||"Não informados")}</p>`;
  html+="</div>";
 });
 html+=`</div><p class="hint" style="margin-top:14px">Revise os campos pendentes. Não foram criados resultados de exames automaticamente.</p>`;
 $("finalSummary").innerHTML=html;
}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
function reportText(d){
 return `HP DE FORTUNA\nFICHA DE TRIAGEM MÉDICA — RP\nFicha: ${d.numeroFicha}\nData/hora de criação: ${new Date().toLocaleString("pt-BR")}\n${"=".repeat(48)}\n\nIDENTIFICAÇÃO\nPaciente: ${d.nome}\nIdade: ${d.idade}\nSexo: ${d.sexo}\nLocal: ${d.unidade}\nProfissional no RP: ${d.profissional}\n\nQUEIXA E SINTOMAS\nQueixa: ${d.queixa}\nInício: ${d.inicioSintomas}\nLocal da dor: ${d.localDor}\nIntensidade: ${d.intensidade}\nInício da dor: ${d.inicioDor}\nSintomas selecionados: ${d.sintomasSelecionados.join(", ")||"Não informados"}\nOutros sintomas: ${d.outrosSintomas}\n\nAVALIAÇÃO CLÍNICA\nConsciência: ${d.consciencia}\nRespiração: ${d.respiracao}\nAvaliação neurológica: ${d.neurologico}\nExame físico: ${d.exameFisico}\n\nSINAIS VITAIS\nPressão arterial: ${d.pa} mmHg\nFrequência cardíaca: ${d.fc} bpm\nFrequência respiratória: ${d.fr} irpm\nTemperatura: ${d.temperatura} °C\nSaturação O2: ${d.spo2}%\nGlicemia: ${d.glicemia}\n\nHISTÓRICO MÉDICO\nAntecedentes: ${d.historico}\nMedicamentos: ${d.medicamentos}\nAlergias: ${d.alergias}\nOutras informações: ${d.antecedentes}\n\nCLASSIFICAÇÃO E CONDUTA\nPrioridade registrada no RP: ${d.prioridade}\nConduta: ${d.conduta}\nObservações: ${d.observacoes}\n\nPENDÊNCIAS\nCampos vazios ou marcados como “a investigar”, “não avaliado” ou “não aferida” precisam ser confirmados.\n\nAVISO: simulação de roleplay. Não é prontuário clínico real e não substitui avaliação profissional.\n`;
}
function download(name,content,type){
 const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);
}
$("nextBtn").addEventListener("click",()=>{
 if(page===0 && (!$("nome").value.trim()||!$("idade").value.trim())){alert("Preencha nome e idade antes de continuar.");return;}
 if(page===1 && !$("queixa").value.trim()){alert("Preencha a queixa principal.");return;}
 page=Math.min(6,page+1);renderPage();
});
$("prevBtn").addEventListener("click",()=>{page=Math.max(0,page-1);renderPage();});
$("downloadTxt").addEventListener("click",()=>{const d=getData();download("ficha_triagem_rp.txt",reportText(d),"text/plain;charset=utf-8");});
$("downloadJson").addEventListener("click",()=>{const d=getData();download("ficha_triagem_rp.json",JSON.stringify(d,null,2),"application/json;charset=utf-8");});
$("resetBtn").addEventListener("click",()=>{
 if(!confirm("Deseja apagar os dados e iniciar uma nova ficha em branco?"))return;
 $("triageForm").reset();selectedSymptoms.clear();document.querySelectorAll("#symptomCatalog input[type=checkbox]").forEach(c=>c.checked=false);
 page=0;renderPage();
});
$("now").textContent=new Date().toLocaleString("pt-BR");
renderCatalog();renderPage();
