// Curso de Python · Módulo 4: IA con Python.
// Fuentes: documentación oficial de NumPy, pandas 3, scikit-learn, PyTorch, la API de Claude (Anthropic),
// sentence-transformers, FastAPI y coremltools.
import { link } from '../sources.js'
import { M4, R, lines } from './common.js'

const NUMPY = link('NumPy · User Guide', 'https://numpy.org/doc/stable/user/')
const PANDAS = link('pandas 3.0 · User Guide', 'https://pandas.pydata.org/docs/user_guide/')
const PANDAS3 = link('pandas · Novedades de 3.0', 'https://pandas.pydata.org/docs/whatsnew/v3.0.0.html')
const SKLEARN = link('scikit-learn · User Guide', 'https://scikit-learn.org/stable/user_guide.html')
const TORCH = link('PyTorch · Tutoriales', 'https://docs.pytorch.org/tutorials/')
const COREMLTOOLS = link('Apple · coremltools', 'https://apple.github.io/coremltools/docs-guides/')
const CLAUDE_API = link('Claude API · Documentación', 'https://platform.claude.com/docs/')
const CLAUDE_STRUCT = link('Claude API · Salidas estructuradas', 'https://platform.claude.com/docs/en/build-with-claude/structured-outputs')
const CLAUDE_TOOLS = link('Claude API · Uso de herramientas', 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview')
const SBERT = link('Sentence Transformers · Documentación', 'https://www.sbert.net/')
const FASTAPI = link('FastAPI · Documentación', 'https://fastapi.tiangolo.com/')
const PYDANTIC = link('Pydantic · Documentación', 'https://docs.pydantic.dev/')

export const pyModule4 = [
  /* ===================== 16. NUMPY Y PANDAS ===================== */
  {
    id: 'pyai-data',
    module: M4,
    title: 'Datos con NumPy y pandas',
    subtitle: 'Arreglos, vectorización y DataFrames (pandas 3)',
    icon: '📊',
    color: '#013243',
    sources: [NUMPY, PANDAS, PANDAS3],
    intro: 'Toda la IA empieza con **datos**. NumPy es la base numérica de casi todas las librerías de IA, y pandas es la herramienta para limpiar y explorar tablas. Usaremos **pandas 3.0**, que cambió algunos comportamientos importantes.',
    reading: [
      {
        h: 'NumPy: arreglos rápidos',
        p: 'Un `ndarray` de NumPy guarda números del mismo tipo en un bloque de memoria contiguo. Las operaciones se aplican a **todo el arreglo a la vez** (vectorización) y corren en C, decenas o cientos de veces más rápido que un `for` de Python.',
        code: R`import numpy as np

precios = np.array([120.0, 85.5, 230.0, 45.0])
con_iva = precios * 1.16                  # sin for: se aplica a todos
print(con_iva.round(2))                   # [139.2   99.18 266.8   52.2 ]
print(precios.mean(), precios.max())      # 120.125 230.0
print(precios[precios > 100])             # [120. 230.]  filtrado con máscara`,
      },
      {
        h: 'Forma, ejes y broadcasting',
        p: 'Los arreglos tienen **forma** (`shape`): una tabla de 3 filas y 2 columnas es `(3, 2)`. Muchas operaciones aceptan `axis` para trabajar por filas o columnas. El **broadcasting** permite operar arreglos de formas compatibles sin copiar datos.',
        code: R`ventas = np.array([[10, 20],      # tienda A: enero, febrero
                   [30, 40],      # tienda B
                   [50, 60]])     # tienda C
print(ventas.shape)               # (3, 2)
print(ventas.sum(axis=0))         # por mes:    [ 90 120]
print(ventas.sum(axis=1))         # por tienda: [ 30  70 110]
print(ventas * np.array([1.0, 1.1]))   # broadcasting: +10 % en febrero`,
      },
      {
        h: 'pandas: tablas con nombre',
        p: 'Un **DataFrame** es una tabla con columnas con nombre (cada columna es una **Series**). Lee CSV, Excel, JSON o SQL en una línea. Se seleccionan columnas por nombre y filas con condiciones.',
        code: R`import pandas as pd

df = pd.read_csv("ventas.csv")         # fecha, tienda, producto, cantidad, precio
print(df.head())                       # primeras filas
print(df.dtypes)                       # tipos de cada columna
df["total"] = df["cantidad"] * df["precio"]
caras = df[df["precio"] > 100]
print(caras[["producto", "total"]])`,
      },
      {
        h: 'Agrupar y resumir',
        p: '`groupby` divide la tabla en grupos, aplica una función y combina los resultados: la base de cualquier reporte. `sort_values` ordena y `value_counts` cuenta.',
        code: R`resumen = (
    df.groupby("tienda")
      .agg(ventas=("total", "sum"), pedidos=("total", "count"))
      .sort_values("ventas", ascending=False)
)
print(resumen)
print(df["producto"].value_counts().head(3))   # los 3 más vendidos`,
      },
      {
        h: 'Lo nuevo de pandas 3.0',
        p: 'pandas 3.0 (enero 2026) trajo dos cambios grandes:\n• **Tipo `str` por defecto** para columnas de texto (antes eran `object`): más rápido y con menos memoria.\n• **Copy-on-Write siempre activo**: cualquier selección se comporta como una **copia**. Modificar un subconjunto ya no cambia el original por accidente, y desaparece el famoso `SettingWithCopyWarning`.',
        code: R`df = pd.DataFrame({"producto": ["café", "pan"], "precio": [45, 12]})
print(df["producto"].dtype)        # str   (pandas 3)

baratos = df[df["precio"] < 20]
baratos["precio"] = 0              # solo cambia "baratos"; df queda intacto
df.loc[df["precio"] < 20, "precio"] = 10   # así se modifica el original`,
      },
      {
        h: 'Datos faltantes y limpieza',
        p: 'Los datos reales vienen sucios. `isna()` encuentra faltantes, `fillna()` los rellena, `dropna()` los quita y `drop_duplicates()` elimina repetidos. Convierte fechas con `pd.to_datetime`.',
        code: R`df["fecha"] = pd.to_datetime(df["fecha"])
print(df.isna().sum())                         # faltantes por columna
df["precio"] = df["precio"].fillna(df["precio"].median())
df = df.dropna(subset=["producto"]).drop_duplicates()
por_mes = df.groupby(df["fecha"].dt.to_period("M"))["total"].sum()`,
      },
    ],
    summary: [
      'NumPy: arreglos rápidos y **vectorizados**; filtra con máscaras booleanas.',
      '`shape` y `axis` controlan dimensiones; el broadcasting combina formas compatibles.',
      'pandas: `DataFrame` = tabla con columnas con nombre; `read_csv` carga datos.',
      '`groupby` + `agg` resume por grupos.',
      'pandas 3: tipo `str` por defecto y Copy-on-Write siempre activo.',
      'Limpia con `isna`, `fillna`, `dropna`, `drop_duplicates` y `to_datetime`.',
    ],
    lessons: [
      {
        title: 'NumPy',
        questions: [
          { t: 'mc', q: '¿Por qué NumPy es más rápido que un for de Python?', opts: ['Opera todo el arreglo a la vez en código C (vectorización)', 'Usa la GPU siempre', 'Comprime los datos', 'Usa varios procesos'], a: 0, ex: 'Evita el costo de un bucle de Python por elemento.' },
          { t: 'mc', q: 'Una tabla de 3 filas y 2 columnas tiene `shape`…', opts: ['(3, 2)', '(2, 3)', '6', '[3, 2]'], a: 0, ex: 'Filas primero, columnas después.' },
          { t: 'mc', q: 'En un arreglo `(3, 2)`, ¿qué suma `sum(axis=0)`?', opts: ['Cada columna (resultado de 2 valores)', 'Cada fila', 'Todo', 'Nada'], a: 0, ex: 'axis=0 recorre hacia abajo (filas).' },
          { t: 'fill', q: 'Completa para quedarte con los precios mayores a 100.', code: R`caros = precios[precios ___ 100]`, opts: ['>', '>>', 'gt', '=>'], a: '>', ex: 'Una comparación crea una máscara booleana.' },
          { t: 'tf', q: 'Broadcasting permite multiplicar una tabla (3, 2) por un arreglo de 2 valores sin un for.', a: true, ex: 'Las formas son compatibles.' },
          { t: 'mc', q: '¿Cuál es la convención para importar NumPy?', opts: ['import numpy as np', 'import np', 'from numpy import *', 'import NumPy'], a: 0, ex: 'Universal en la comunidad.' },
        ],
      },
      {
        title: 'pandas',
        questions: [
          { t: 'mc', q: '¿Qué es un DataFrame?', opts: ['Una tabla con columnas con nombre', 'Una imagen', 'Un modelo de IA', 'Un archivo CSV'], a: 0, ex: 'Cada columna es una Series.' },
          { t: 'mc', q: '¿Qué hace `df.groupby("tienda")["total"].sum()`?', opts: ['Suma el total de cada tienda', 'Ordena por tienda', 'Cuenta las filas', 'Borra la columna tienda'], a: 0, ex: 'Dividir, aplicar y combinar.' },
          { t: 'mc', q: 'En pandas 3.0, ¿qué tipo tiene una columna de textos?', opts: ['str', 'object', 'string[python] obligatorio', 'category'], a: 0, ex: 'Nuevo tipo de texto por defecto.' },
          { t: 'tf', q: 'En pandas 3.0, modificar `baratos = df[df.precio < 20]` también cambia `df`.', a: false, ex: 'Copy-on-Write: la selección se comporta como copia.' },
          { t: 'mc', q: '¿Cómo modificas el DataFrame original para ciertas filas?', opts: ['df.loc[condición, "col"] = valor', 'df[condición]["col"] = valor', 'df.set(condición)', 'df.update_rows()'], a: 0, ex: 'Con `.loc` en una sola operación.' },
          { t: 'mc', q: '¿Qué función cuenta los valores faltantes por columna?', opts: ['df.isna().sum()', 'df.count_null()', 'df.missing()', 'len(df)'], a: 0, ex: '`isna()` marca faltantes y `sum()` los cuenta.' },
        ],
      },
    ],
  },

  /* ===================== 17. SCIKIT-LEARN ===================== */
  {
    id: 'pyai-ml',
    module: M4,
    title: 'Machine Learning con scikit-learn',
    subtitle: 'Entrenar, evaluar y guardar un modelo clásico',
    icon: '🤖',
    color: '#F7931E',
    sources: [SKLEARN, link('scikit-learn · Pipelines', 'https://scikit-learn.org/stable/modules/compose.html'), link('scikit-learn · Evaluación de modelos', 'https://scikit-learn.org/stable/modules/model_evaluation.html')],
    intro: '**scikit-learn** es la librería estándar de *machine learning* clásico: clasificación, regresión, agrupamiento. Todos sus modelos comparten la misma interfaz: `fit` para aprender y `predict` para predecir.',
    reading: [
      {
        h: 'El flujo de trabajo',
        p: 'Casi todo proyecto de ML sigue los mismos pasos:',
        diagram: { kind: 'flow', steps: [{ icon: '📥', t: 'Datos', d: 'features X y etiquetas y' }, { icon: '✂️', t: 'Dividir', d: 'entrenamiento / prueba' }, { icon: '🏋️', t: 'Entrenar', d: '`model.fit(X, y)`' }, { icon: '📏', t: 'Evaluar', d: 'con datos nunca vistos' }, { icon: '💾', t: 'Guardar', d: 'y usar en producción' }], caption: 'El ciclo básico del machine learning.' },
      },
      {
        h: 'Dividir los datos',
        p: 'Para saber si el modelo **generaliza**, se evalúa con datos que **no vio** al entrenar. `train_test_split` separa, por ejemplo, 80 % para entrenar y 20 % para probar. `stratify` mantiene la proporción de clases.',
        code: R`import pandas as pd
from sklearn.model_selection import train_test_split

df = pd.read_csv("clientes.csv")          # edad, visitas, gasto, ..., se_fue (0/1)
X = df.drop(columns="se_fue")             # features
y = df["se_fue"]                          # etiqueta

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)`,
      },
      {
        h: 'Pipelines: preprocesar + modelo',
        p: 'Los modelos necesitan números en escalas parecidas. Un **Pipeline** encadena el preprocesamiento (escalar números, convertir categorías) con el modelo, y garantiza que a los datos nuevos se les aplique **exactamente la misma transformación**.',
        code: R`from sklearn.pipeline import make_pipeline
from sklearn.compose import make_column_transformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestClassifier

preprocesar = make_column_transformer(
    (StandardScaler(), ["edad", "visitas", "gasto"]),
    (OneHotEncoder(handle_unknown="ignore"), ["ciudad", "plan"]),
)
modelo = make_pipeline(preprocesar, RandomForestClassifier(n_estimators=200, random_state=42))
modelo.fit(X_train, y_train)`,
      },
      {
        h: 'Evaluar',
        p: 'La **exactitud** (accuracy) engaña cuando una clase es rara. Revisa también **precisión** (de los que predije como positivos, cuántos lo eran), **recall** (de los positivos reales, cuántos encontré) y la **matriz de confusión**.',
        code: R`from sklearn.metrics import classification_report, confusion_matrix

pred = modelo.predict(X_test)
print(classification_report(y_test, pred))
print(confusion_matrix(y_test, pred))
prob = modelo.predict_proba(X_test)[:, 1]     # probabilidad de irse`,
      },
      {
        h: 'Validación cruzada y ajuste',
        p: 'Con **validación cruzada** el modelo se entrena y evalúa varias veces con distintas divisiones: el resultado es más confiable. `GridSearchCV` prueba combinaciones de **hiperparámetros** y elige la mejor.',
        code: R`from sklearn.model_selection import cross_val_score, GridSearchCV

print(cross_val_score(modelo, X_train, y_train, cv=5, scoring="f1").mean())

busqueda = GridSearchCV(
    modelo,
    {"randomforestclassifier__max_depth": [5, 10, None]},
    cv=5, scoring="f1",
)
busqueda.fit(X_train, y_train)
print(busqueda.best_params_, busqueda.best_score_)`,
      },
      {
        h: 'Guardar y usar el modelo',
        p: 'Guarda el pipeline entrenado con `joblib` y cárgalo después para predecir con datos nuevos (en un servidor, por ejemplo). Para llevarlo a iOS, **coremltools** puede convertir varios modelos de scikit-learn a Core ML.',
        code: R`import joblib

joblib.dump(modelo, "modelo_churn.joblib")
modelo = joblib.load("modelo_churn.joblib")
nuevo = pd.DataFrame([{"edad": 34, "visitas": 2, "gasto": 150.0, "ciudad": "CDMX", "plan": "básico"}])
print(modelo.predict_proba(nuevo)[0, 1])     # p. ej. 0.73 → riesgo alto`,
        warn: 'Solo carga archivos `joblib`/`pickle` de fuentes confiables: al cargarlos se puede ejecutar código.',
      },
    ],
    summary: [
      'Flujo: datos → dividir → entrenar (`fit`) → evaluar → guardar.',
      'Evalúa con datos no vistos: `train_test_split` (con `stratify`).',
      'Un **Pipeline** une preprocesamiento y modelo y evita errores.',
      'Mira precisión, recall y matriz de confusión, no solo exactitud.',
      'Validación cruzada y `GridSearchCV` dan resultados más confiables.',
      'Guarda con `joblib`; coremltools puede llevar modelos a iOS.',
    ],
    lessons: [
      {
        title: 'Entrenar',
        questions: [
          { t: 'mc', q: '¿Qué método entrena un modelo de scikit-learn?', opts: ['fit', 'train', 'learn', 'run'], a: 0, ex: 'Y `predict` predice.' },
          { t: 'mc', q: '¿Por qué se separan datos de prueba?', opts: ['Para medir si el modelo generaliza a datos nuevos', 'Para entrenar más rápido', 'Para ahorrar memoria', 'Es obligatorio por ley'], a: 0, ex: 'Evaluar con datos de entrenamiento sería hacer trampa.' },
          { t: 'mc', q: '¿Qué hace `stratify=y` en `train_test_split`?', opts: ['Mantiene la proporción de clases en ambas partes', 'Ordena los datos', 'Elimina duplicados', 'Escala los números'], a: 0, ex: 'Importante cuando una clase es rara.' },
          { t: 'mc', q: '¿Para qué sirve un Pipeline?', opts: ['Encadenar preprocesamiento y modelo con la misma transformación siempre', 'Descargar datos', 'Dibujar gráficas', 'Paralelizar'], a: 0, ex: 'Evita aplicar transformaciones distintas al predecir.' },
          { t: 'mc', q: '¿Qué hace `OneHotEncoder`?', opts: ['Convierte categorías en columnas de 0 y 1', 'Escala números', 'Borra columnas', 'Cuenta filas'], a: 0, ex: '“CDMX” se vuelve una columna `ciudad_CDMX`.' },
          { t: 'fill', q: 'Completa para entrenar el modelo.', code: R`modelo.___(X_train, y_train)`, opts: ['fit', 'predict', 'score', 'train'], a: 'fit', ex: 'La interfaz común de scikit-learn.' },
        ],
      },
      {
        title: 'Evaluar y guardar',
        questions: [
          { t: 'mc', q: 'Solo 2 % de los clientes se van. Un modelo que dice “nadie se va” tiene 98 % de exactitud. ¿Qué métrica revela que es inútil?', opts: ['Recall de la clase “se va”', 'Accuracy', 'El tiempo de entrenamiento', 'El número de columnas'], a: 0, ex: 'Su recall para los que se van es 0.' },
          { t: 'mc', q: '¿Qué mide la precisión?', opts: ['De los que predije positivos, cuántos lo eran', 'De los positivos reales, cuántos encontré', 'El total de aciertos', 'La velocidad'], a: 0, ex: 'El recall es lo segundo.' },
          { t: 'mc', q: '¿Qué hace `GridSearchCV`?', opts: ['Prueba combinaciones de hiperparámetros con validación cruzada', 'Dibuja una cuadrícula', 'Divide los datos en celdas', 'Busca archivos'], a: 0, ex: 'Elige la mejor combinación.' },
          { t: 'mc', q: '¿Qué devuelve `predict_proba`?', opts: ['La probabilidad de cada clase', 'La clase predicha', 'La exactitud', 'Los datos escalados'], a: 0, ex: '`[:, 1]` es la probabilidad de la clase positiva.' },
          { t: 'tf', q: 'Es seguro cargar un archivo joblib de cualquier fuente de internet.', a: false, ex: 'Puede ejecutar código malicioso al cargarse.' },
          { t: 'mc', q: '¿Qué herramienta convierte modelos de Python a Core ML para iOS?', opts: ['coremltools', 'joblib', 'pandas', 'pip'], a: 0, ex: 'La ves también en el curso de IA para iOS.' },
        ],
      },
    ],
  },

  /* ===================== 18. PYTORCH ===================== */
  {
    id: 'pyai-torch',
    module: M4,
    title: 'Deep Learning con PyTorch',
    subtitle: 'Tensores, autograd, redes, entrenamiento y exportar a iOS',
    icon: '🔥',
    color: '#EE4C2C',
    sources: [TORCH, link('PyTorch · torch.compile', 'https://docs.pytorch.org/tutorials/intermediate/torch_compile_tutorial.html'), link('PyTorch · torch.export', 'https://docs.pytorch.org/docs/stable/export.html'), COREMLTOOLS],
    intro: '**PyTorch** es el framework de *deep learning* más usado en investigación y en la industria (la versión actual es la 2.15). Aquí entenderás sus piezas y entrenarás una red neuronal completa.',
    reading: [
      {
        h: 'Tensores',
        p: 'Un **tensor** es como un arreglo de NumPy, pero puede vivir en la **GPU** y recordar cómo se calculó (para entrenar). Se crean desde listas o NumPy y se mueven de dispositivo con `.to(device)`. En Mac con Apple silicon el dispositivo es `"mps"`.',
        code: R`import torch

device = "cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu"
x = torch.tensor([[1.0, 2.0], [3.0, 4.0]], device=device)
print(x.shape, x.dtype, x.device)     # torch.Size([2, 2]) torch.float32 mps:0
print(x @ x.T)                        # multiplicación de matrices`,
      },
      {
        h: 'Autograd: derivadas automáticas',
        p: 'Si un tensor tiene `requires_grad=True`, PyTorch registra las operaciones y con `.backward()` calcula los **gradientes**: cuánto cambia el resultado si cambias cada valor. Eso es lo que usa el descenso de gradiente para aprender.',
        code: R`w = torch.tensor(2.0, requires_grad=True)
perdida = (w * 3 - 12) ** 2      # queremos w * 3 = 12
perdida.backward()
print(w.grad)                    # tensor(-36.) → hay que subir w`,
      },
      {
        h: 'Definir una red con nn.Module',
        p: 'Una red neuronal es una clase que hereda de `nn.Module`: en `__init__` declaras las capas y en `forward` describes cómo pasan los datos.',
        code: R`from torch import nn

class Clasificador(nn.Module):
    def __init__(self, entradas: int, clases: int):
        super().__init__()
        self.red = nn.Sequential(
            nn.Linear(entradas, 64),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(64, clases),
        )

    def forward(self, x):
        return self.red(x)

modelo = Clasificador(entradas=20, clases=3).to(device)`,
      },
      {
        h: 'El ciclo de entrenamiento',
        p: 'Entrenar es repetir: **predecir → medir la pérdida → calcular gradientes → ajustar pesos**. Los datos se reparten en lotes con un `DataLoader`. Una **época** es una pasada completa por los datos.',
        code: R`from torch.utils.data import DataLoader, TensorDataset

datos = TensorDataset(X_train, y_train)               # tensores ya preparados
cargador = DataLoader(datos, batch_size=64, shuffle=True)
perdida_fn = nn.CrossEntropyLoss()
optimizador = torch.optim.AdamW(modelo.parameters(), lr=1e-3)

for epoca in range(10):
    modelo.train()
    for xb, yb in cargador:
        xb, yb = xb.to(device), yb.to(device)
        pred = modelo(xb)                  # 1. predecir
        perdida = perdida_fn(pred, yb)     # 2. medir el error
        optimizador.zero_grad()
        perdida.backward()                 # 3. gradientes
        optimizador.step()                 # 4. ajustar pesos
    print(f"Época {epoca + 1}: pérdida {perdida.item():.3f}")`,
      },
      {
        h: 'Evaluar e inferir',
        p: 'Para evaluar, pon el modelo en modo `eval()` (desactiva Dropout) y usa `torch.inference_mode()` para no registrar gradientes (más rápido y con menos memoria). `torch.compile` puede acelerar el modelo compilándolo.',
        code: R`modelo.eval()
with torch.inference_mode():
    logits = modelo(X_test.to(device))
    pred = logits.argmax(dim=1)
    exactitud = (pred == y_test.to(device)).float().mean()
print(f"Exactitud: {exactitud:.1%}")

modelo_rapido = torch.compile(modelo)     # opcional: más velocidad`,
      },
      {
        h: 'Guardar y llevar a iOS',
        p: 'Guarda los **pesos** con `state_dict`. Para usar el modelo en una app de iPhone: expórtalo con `torch.export` y conviértelo con **coremltools** a un paquete de Core ML (lo viste en el curso de IA para iOS).',
        code: R`torch.save(modelo.state_dict(), "clasificador.pt")

import coremltools as ct
modelo.eval().to("cpu")
ejemplo = torch.rand(1, 20)
programa = torch.export.export(modelo, (ejemplo,))
mlmodel = ct.convert(programa)
mlmodel.save("Clasificador.mlpackage")      # arrástralo a Xcode`,
        tip: 'TorchScript (`torch.jit`) está obsoleto desde PyTorch 2.10: usa `torch.export` para exportar modelos.',
      },
    ],
    summary: [
      'Un **tensor** es un arreglo que puede vivir en GPU (`cuda`, `mps`) y registrar operaciones.',
      '**Autograd**: `.backward()` calcula gradientes automáticamente.',
      'Las redes heredan de `nn.Module` y definen `forward`.',
      'Entrenar: predecir → pérdida → `backward()` → `optimizador.step()`, por lotes y épocas.',
      'Evalúa con `model.eval()` y `torch.inference_mode()`; `torch.compile` acelera.',
      'Guarda con `state_dict`; exporta con `torch.export` y convierte a Core ML con coremltools.',
    ],
    lessons: [
      {
        title: 'Piezas de PyTorch',
        questions: [
          { t: 'mc', q: '¿Qué ventaja tiene un tensor de PyTorch sobre un arreglo de NumPy?', opts: ['Puede usar la GPU y calcular gradientes', 'Ocupa menos memoria siempre', 'Solo guarda enteros', 'Se guarda en la nube'], a: 0, ex: 'Por eso es la base del deep learning.' },
          { t: 'mc', q: 'En una Mac con Apple silicon, ¿qué dispositivo usa PyTorch para acelerar?', opts: ['mps', 'cuda', 'tpu', 'neural'], a: 0, ex: 'Metal Performance Shaders.' },
          { t: 'mc', q: '¿Qué hace `perdida.backward()`?', opts: ['Calcula los gradientes', 'Deshace el último paso', 'Guarda el modelo', 'Borra la pérdida'], a: 0, ex: 'Autograd recorre las operaciones hacia atrás.' },
          { t: 'mc', q: '¿Qué método define cómo fluyen los datos en un `nn.Module`?', opts: ['forward', 'run', 'predict', '__call_net__'], a: 0, ex: 'Se ejecuta al llamar `modelo(x)`.' },
          { t: 'tf', q: 'Una época es una pasada completa por todos los datos de entrenamiento.', a: true, ex: 'Cada época tiene muchos lotes.' },
          { t: 'order', q: 'Ordena un paso de entrenamiento.', lines: ['pred = modelo(xb)', 'perdida = perdida_fn(pred, yb)', 'optimizador.zero_grad()', 'perdida.backward()', 'optimizador.step()'], ex: 'Predecir, medir, limpiar gradientes, calcular y ajustar.' },
        ],
      },
      {
        title: 'Evaluar y exportar',
        questions: [
          { t: 'mc', q: '¿Por qué llamar `modelo.eval()` antes de evaluar?', opts: ['Desactiva capas como Dropout', 'Guarda el modelo', 'Lo hace más grande', 'Borra los pesos'], a: 0, ex: 'Dropout solo debe actuar al entrenar.' },
          { t: 'mc', q: '¿Qué hace `torch.inference_mode()`?', opts: ['Evita registrar gradientes para inferir más rápido', 'Entrena el modelo', 'Cambia a la GPU', 'Exporta el modelo'], a: 0, ex: 'Ahorra memoria y tiempo.' },
          { t: 'mc', q: '¿Qué guarda `modelo.state_dict()`?', opts: ['Los pesos del modelo', 'El código de la clase', 'Los datos de entrenamiento', 'La GPU'], a: 0, ex: 'Se cargan con `load_state_dict`.' },
          { t: 'mc', q: '¿Qué reemplaza a TorchScript para exportar modelos?', opts: ['torch.export', 'pickle', 'torch.jit.script', 'joblib'], a: 0, ex: 'TorchScript está obsoleto desde 2.10.' },
          { t: 'fill', q: 'Completa para convertir el programa exportado a Core ML.', code: R`mlmodel = ct.___(programa)`, opts: ['convert', 'export', 'save', 'compile'], a: 'convert', ex: '`coremltools.convert`.' },
          { t: 'tf', q: '`torch.compile` puede acelerar un modelo sin cambiar su código.', a: true, ex: 'Compila el grafo de operaciones.' },
        ],
      },
    ],
  },

  /* ===================== 19. LLMS DESDE PYTHON ===================== */
  {
    id: 'pyai-llm',
    module: M4,
    title: 'LLMs desde Python',
    subtitle: 'La API de Claude: mensajes, streaming y salidas estructuradas',
    icon: '💬',
    color: '#D97757',
    sources: [CLAUDE_API, CLAUDE_STRUCT, PYDANTIC],
    intro: 'Los modelos de lenguaje (LLMs) se usan desde Python con un **SDK**: una librería que llama a la API por ti. Usaremos el SDK oficial de Anthropic para **Claude**; la mayoría de los SDK de otros proveedores siguen ideas muy parecidas.',
    reading: [
      {
        h: 'Instalar y configurar',
        p: 'Instala el SDK y guarda tu clave en la variable de entorno `ANTHROPIC_API_KEY` (nunca en el código). El cliente la lee automáticamente.',
        code: R`uv add anthropic pydantic
export ANTHROPIC_API_KEY="sk-ant-..."     # en tu terminal o en un .env`,
      },
      {
        h: 'Tu primer mensaje',
        p: 'Envías una lista de **mensajes** (`user` y `assistant`) y opcionalmente un **system prompt** con el rol y las reglas. `max_tokens` limita la longitud de la respuesta. La respuesta trae bloques de contenido y el **uso de tokens** (que determina el costo).',
        code: R`import anthropic

cliente = anthropic.Anthropic()          # lee ANTHROPIC_API_KEY

respuesta = cliente.messages.create(
    model="claude-sonnet-5-5",
    max_tokens=500,
    system="Eres un tutor de programación paciente. Responde en español.",
    messages=[{"role": "user", "content": "¿Qué es una list comprehension? Dame un ejemplo."}],
)
print(respuesta.content[0].text)
print(respuesta.usage.input_tokens, respuesta.usage.output_tokens)`,
      },
      {
        h: 'Conversaciones',
        p: 'La API **no recuerda** nada entre llamadas: para conversar, envías el historial completo cada vez, alternando `user` y `assistant`.',
        code: R`historial = []

def preguntar(texto: str) -> str:
    historial.append({"role": "user", "content": texto})
    r = cliente.messages.create(model="claude-sonnet-5-5", max_tokens=500, messages=historial)
    texto_respuesta = r.content[0].text
    historial.append({"role": "assistant", "content": texto_respuesta})
    return texto_respuesta

preguntar("Mi lenguaje favorito es Python.")
print(preguntar("¿Cuál dije que era mi lenguaje favorito?"))`,
      },
      {
        h: 'Streaming',
        p: 'Con **streaming** recibes la respuesta **mientras se genera**, palabra por palabra, en vez de esperar a que termine. Mejora mucho la experiencia en chats.',
        code: R`with cliente.messages.stream(
    model="claude-sonnet-5-5",
    max_tokens=800,
    messages=[{"role": "user", "content": "Escribe un haiku sobre Python."}],
) as stream:
    for texto in stream.text_stream:
        print(texto, end="", flush=True)`,
      },
      {
        h: 'Salidas estructuradas con Pydantic',
        p: 'Para usar la respuesta en tu programa necesitas **datos**, no prosa. Defines la forma con un modelo de **Pydantic** y usas `messages.parse()`: el SDK le pide al modelo un JSON con esa forma, lo **valida** y te devuelve un objeto de Python en `parsed_output`.',
        code: R`from pydantic import BaseModel

class Gasto(BaseModel):
    comercio: str
    total: float
    categoria: str
    fecha: str

r = cliente.messages.parse(
    model="claude-sonnet-5-5",
    max_tokens=500,
    messages=[{"role": "user", "content": "Extrae los datos: 'Oxxo Reforma 18/11/2026 TOTAL $87.50 (snacks)'"}],
    output_format=Gasto,
)
gasto = r.parsed_output
print(gasto.comercio, gasto.total)     # Oxxo Reforma 87.5`,
      },
      {
        h: 'Asíncrono, errores y costos',
        p: 'Con `AsyncAnthropic` haces muchas llamadas concurrentes con asyncio. El SDK **reintenta** automáticamente ciertos errores (límite de uso, errores temporales del servidor). Controla el costo limitando `max_tokens`, enviando solo el contexto necesario y midiendo `usage`.',
        code: R`import asyncio
from anthropic import AsyncAnthropic, APIError

cliente_async = AsyncAnthropic()

async def resumir(texto: str) -> str:
    try:
        r = await cliente_async.messages.create(
            model="claude-sonnet-5-5", max_tokens=200,
            messages=[{"role": "user", "content": f"Resume en una frase:\n{texto}"}],
        )
        return r.content[0].text
    except APIError as e:
        return f"No se pudo resumir ({e.__class__.__name__})"

async def main(textos):
    async with asyncio.TaskGroup() as tg:
        tareas = [tg.create_task(resumir(t)) for t in textos]
    return [t.result() for t in tareas]`,
      },
    ],
    summary: [
      'Instala el SDK (`anthropic`) y usa la variable `ANTHROPIC_API_KEY`.',
      '`messages.create` con `model`, `max_tokens`, `system` y `messages`.',
      'La API no tiene memoria: envía el historial en cada llamada.',
      '`messages.stream` + `text_stream` para recibir la respuesta mientras se genera.',
      '`messages.parse(..., output_format=ModeloPydantic)` devuelve datos validados en `parsed_output`.',
      '`AsyncAnthropic` para concurrencia; mide tokens para controlar costos.',
    ],
    lessons: [
      {
        title: 'Llamar al modelo',
        questions: [
          { t: 'mc', q: '¿Dónde debe estar la clave de la API?', opts: ['En la variable de entorno ANTHROPIC_API_KEY', 'Escrita en el código', 'En el prompt', 'En el nombre del archivo'], a: 0, ex: 'El cliente la lee automáticamente.' },
          { t: 'mc', q: '¿Para qué sirve el parámetro `system`?', opts: ['Dar el rol y las reglas al modelo', 'Elegir el sistema operativo', 'Limitar los tokens', 'Activar el streaming'], a: 0, ex: 'Por ejemplo: “Eres un tutor paciente”.' },
          { t: 'mc', q: '¿Qué limita `max_tokens`?', opts: ['La longitud máxima de la respuesta', 'El tamaño del prompt', 'El número de llamadas por día', 'La memoria del modelo'], a: 0, ex: 'Ayuda a controlar costo y tiempo.' },
          { t: 'tf', q: 'La API recuerda automáticamente las conversaciones anteriores.', a: false, ex: 'Hay que enviar el historial en cada llamada.' },
          { t: 'mc', q: '¿Qué determina principalmente el costo de una llamada?', opts: ['Los tokens de entrada y de salida', 'La hora del día', 'El número de líneas de Python', 'La velocidad de internet'], a: 0, ex: 'Revisa `respuesta.usage`.' },
          { t: 'fill', q: 'Completa el rol del mensaje de la persona.', code: R`messages=[{"role": "___", "content": "Hola"}]`, opts: ['user', 'human', 'client', 'person'], a: 'user', ex: 'Los roles son `user` y `assistant`.' },
        ],
      },
      {
        title: 'Streaming y datos estructurados',
        questions: [
          { t: 'mc', q: '¿Qué ventaja tiene el streaming?', opts: ['Muestras la respuesta mientras se genera', 'La respuesta es más barata', 'El modelo es más inteligente', 'No necesita clave'], a: 0, ex: 'Mejora la experiencia en chats.' },
          { t: 'mc', q: '¿Qué método del SDK valida la respuesta contra un modelo de Pydantic?', opts: ['messages.parse', 'messages.validate', 'messages.json', 'messages.create_model'], a: 0, ex: 'Con `output_format=MiModelo`.' },
          { t: 'mc', q: '¿Dónde queda el objeto ya validado?', opts: ['respuesta.parsed_output', 'respuesta.content[0]', 'respuesta.json()', 'respuesta.data'], a: 0, ex: 'Es una instancia de tu modelo de Pydantic.' },
          { t: 'mc', q: '¿Para qué sirve Pydantic en este contexto?', opts: ['Definir y validar la forma de los datos', 'Hacer gráficas', 'Entrenar modelos', 'Servir páginas web'], a: 0, ex: 'Convierte JSON en objetos con tipos verificados.' },
          { t: 'mc', q: '¿Qué cliente usas para hacer muchas llamadas concurrentes con asyncio?', opts: ['AsyncAnthropic', 'Anthropic con hilos obligatorios', 'requests', 'urllib'], a: 0, ex: 'Sus métodos se esperan con `await`.' },
          { t: 'tf', q: 'El SDK reintenta automáticamente algunos errores temporales.', a: true, ex: 'Como límites de uso o errores del servidor.' },
        ],
      },
    ],
  },

  /* ===================== 20. EMBEDDINGS, RAG Y AGENTES ===================== */
  {
    id: 'pyai-rag',
    module: M4,
    title: 'Embeddings, RAG y agentes',
    subtitle: 'Buscar por significado, responder con tus documentos y usar herramientas',
    icon: '🧠',
    color: '#6D28D9',
    sources: [SBERT, CLAUDE_TOOLS, link('Claude API · Embeddings', 'https://platform.claude.com/docs/en/build-with-claude/embeddings')],
    intro: 'Un LLM no conoce **tus** documentos ni puede consultar **tus** sistemas. Con **RAG** le das la información relevante en cada pregunta, y con **herramientas** le permites actuar: así se construyen los asistentes y agentes modernos.',
    reading: [
      {
        h: 'Embeddings: el significado como números',
        p: 'Un **embedding** convierte un texto en un vector de números de modo que textos con **significado parecido** quedan **cerca**. Se compara con la **similitud coseno**. La librería `sentence-transformers` genera embeddings localmente.',
        code: R`from sentence_transformers import SentenceTransformer
import numpy as np

modelo = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")
frases = ["¿Cómo cambio mi contraseña?", "Olvidé mi clave de acceso", "Horario de la tienda"]
vectores = modelo.encode(frases, normalize_embeddings=True)

similitud = vectores @ vectores.T          # coseno (vectores normalizados)
print(similitud.round(2))                  # las dos primeras quedan muy cerca`,
      },
      {
        h: 'Búsqueda semántica',
        p: 'Para buscar: calculas el embedding de cada documento **una vez**, y al llegar una pregunta calculas el suyo y tomas los más parecidos. Con muchos documentos se usa una **base de datos vectorial** (pgvector, Chroma, Qdrant…), pero la idea es la misma.',
        code: R`documentos = [
    "Para cambiar tu contraseña ve a Perfil > Seguridad.",
    "La tienda abre de 9 a 21 h de lunes a sábado.",
    "Los envíos son gratis en compras mayores a $300.",
]
doc_vecs = modelo.encode(documentos, normalize_embeddings=True)

def buscar(pregunta: str, k: int = 2) -> list[str]:
    q = modelo.encode([pregunta], normalize_embeddings=True)[0]
    puntajes = doc_vecs @ q
    mejores = np.argsort(puntajes)[::-1][:k]
    return [documentos[i] for i in mejores]

print(buscar("¿cuánto cuesta el envío?"))`,
      },
      {
        h: 'RAG: respuestas con tus documentos',
        p: '**RAG** (*Retrieval-Augmented Generation*) = **buscar** los fragmentos relevantes + **dárselos** al LLM junto con la pregunta + pedirle que responda **solo** con esa información. Reduce las invenciones y permite citar fuentes.',
        diagram: { kind: 'flow', steps: [{ icon: '❓', t: 'Pregunta', d: '“¿El envío es gratis?”' }, { icon: '🔎', t: 'Buscar', d: 'top-k por embeddings' }, { icon: '📎', t: 'Aumentar', d: 'pregunta + fragmentos' }, { icon: '💬', t: 'Generar', d: 'el LLM responde citando' }], caption: 'Retrieval-Augmented Generation.' },
        code: R`import anthropic
cliente = anthropic.Anthropic()

def responder(pregunta: str) -> str:
    contexto = "\n".join(f"- {d}" for d in buscar(pregunta, k=3))
    r = cliente.messages.create(
        model="claude-sonnet-5-5",
        max_tokens=300,
        system="Responde SOLO con la información del contexto. Si no está, di que no lo sabes.",
        messages=[{"role": "user", "content": f"Contexto:\n{contexto}\n\nPregunta: {pregunta}"}],
    )
    return r.content[0].text`,
      },
      {
        h: 'Preparar los documentos (chunking)',
        p: 'Los documentos largos se dividen en **fragmentos** (*chunks*) de unos cientos de palabras, con un poco de **solapamiento** para no cortar ideas a la mitad. Guarda con cada fragmento su origen (archivo, página) para poder citarlo.',
        code: R`def fragmentar(texto: str, tamano: int = 800, solape: int = 150) -> list[str]:
    fragmentos, inicio = [], 0
    while inicio < len(texto):
        fragmentos.append(texto[inicio:inicio + tamano])
        inicio += tamano - solape
    return fragmentos`,
      },
      {
        h: 'Herramientas: que el modelo actúe',
        p: 'Con **tool use** describes funciones (nombre, descripción y parámetros en JSON Schema). El modelo decide cuándo llamarlas y con qué argumentos; **tu código** las ejecuta y le devuelve el resultado. Ese ciclo —pensar, usar una herramienta, observar, repetir— es un **agente**.',
        code: R`herramientas = [{
    "name": "consultar_pedido",
    "description": "Devuelve el estado de un pedido por su número.",
    "input_schema": {"type": "object", "properties": {"numero": {"type": "string"}}, "required": ["numero"]},
}]

def consultar_pedido(numero: str) -> str:
    return {"A123": "En camino, llega mañana"}.get(numero, "No encontrado")

mensajes = [{"role": "user", "content": "¿Dónde está mi pedido A123?"}]
while True:
    r = cliente.messages.create(model="claude-sonnet-5-5", max_tokens=500, tools=herramientas, messages=mensajes)
    mensajes.append({"role": "assistant", "content": r.content})
    if r.stop_reason != "tool_use":
        break                                              # respuesta final
    resultados = [
        {"type": "tool_result", "tool_use_id": b.id, "content": consultar_pedido(**b.input)}
        for b in r.content if b.type == "tool_use"
    ]
    mensajes.append({"role": "user", "content": resultados})
print(r.content[0].text)`,
        warn: 'Las herramientas ejecutan **tu** código con argumentos que decide el modelo: valida todo, limita permisos y pide confirmación para acciones irreversibles (pagos, borrar datos).',
      },
      {
        h: 'Evaluar tu sistema de IA',
        p: 'Un asistente con RAG o agentes necesita **pruebas** como cualquier software: un conjunto de preguntas con respuestas esperadas, medido cada vez que cambias el prompt, el modelo o los documentos. Mide si **encontró** los fragmentos correctos y si la **respuesta** es correcta y fiel al contexto.',
        code: R`casos = [
    {"pregunta": "¿El envío es gratis?", "debe_contener": "$300"},
    {"pregunta": "¿A qué hora abren?", "debe_contener": "9"},
]
aciertos = sum(c["debe_contener"] in responder(c["pregunta"]) for c in casos)
print(f"{aciertos}/{len(casos)} correctas")`,
      },
    ],
    summary: [
      'Un **embedding** representa el significado de un texto como vector; se compara con similitud coseno.',
      'Búsqueda semántica: embeddings de documentos + top-k más parecidos a la pregunta.',
      '**RAG**: buscar → agregar el contexto al prompt → generar respondiendo solo con él.',
      'Divide documentos en fragmentos con solapamiento y guarda su origen.',
      '**Tool use**: el modelo pide herramientas, tu código las ejecuta; el ciclo es un agente.',
      'Evalúa con un conjunto de casos cada vez que cambies algo.',
    ],
    lessons: [
      {
        title: 'Embeddings y RAG',
        questions: [
          { t: 'mc', q: '¿Qué es un embedding?', opts: ['Un vector de números que representa el significado de un texto', 'Un tipo de base de datos', 'Un modelo de lenguaje', 'Un archivo comprimido'], a: 0, ex: 'Textos parecidos quedan cerca.' },
          { t: 'mc', q: '¿Con qué medida se suele comparar dos embeddings?', opts: ['Similitud coseno', 'Longitud del texto', 'Número de palabras iguales', 'Orden alfabético'], a: 0, ex: 'Con vectores normalizados es un producto punto.' },
          { t: 'mc', q: '¿Qué significa RAG?', opts: ['Retrieval-Augmented Generation', 'Random Answer Generator', 'Recurrent Attention Graph', 'Rapid API Gateway'], a: 0, ex: 'Buscar, aumentar el prompt y generar.' },
          { t: 'order', q: 'Ordena los pasos de RAG.', lines: ['Calcular el embedding de la pregunta', 'Buscar los fragmentos más parecidos', 'Agregarlos al prompt como contexto', 'Pedir al LLM que responda con ese contexto'], ex: 'Retrieval → Augmentation → Generation.' },
          { t: 'mc', q: '¿Por qué se fragmentan los documentos con solapamiento?', opts: ['Para no cortar ideas a la mitad entre fragmentos', 'Para que ocupen más espacio', 'Porque los LLM no leen PDF', 'Para encriptarlos'], a: 0, ex: 'El solape conserva el contexto en los bordes.' },
          { t: 'tf', q: 'RAG ayuda a reducir que el modelo invente respuestas.', a: true, ex: 'Se le pide responder solo con el contexto dado.' },
        ],
      },
      {
        title: 'Herramientas y agentes',
        questions: [
          { t: 'mc', q: 'En tool use, ¿quién ejecuta la función?', opts: ['Tu código', 'El modelo directamente en tu servidor', 'El navegador', 'Nadie'], a: 0, ex: 'El modelo solo pide la llamada con argumentos.' },
          { t: 'mc', q: '¿Qué `stop_reason` indica que el modelo quiere usar una herramienta?', opts: ['tool_use', 'end_turn', 'max_tokens', 'stop'], a: 0, ex: 'Entonces ejecutas la herramienta y devuelves `tool_result`.' },
          { t: 'mc', q: '¿Cómo se describen los parámetros de una herramienta?', opts: ['Con JSON Schema en input_schema', 'Con un docstring', 'Con type hints obligatorios', 'En el system prompt'], a: 0, ex: 'Nombre, descripción y esquema de entrada.' },
          { t: 'mc', q: '¿Qué es un agente?', opts: ['Un ciclo donde el modelo decide, usa herramientas y observa resultados', 'Un modelo más grande', 'Un tipo de embedding', 'Una base de datos'], a: 0, ex: 'Pensar → actuar → observar → repetir.' },
          { t: 'tf', q: 'Una herramienta que hace pagos debería ejecutarse sin confirmación para que el agente sea más rápido.', a: false, ex: 'Las acciones irreversibles requieren confirmación y validación.' },
          { t: 'mc', q: '¿Cómo sabes si un cambio de prompt empeoró tu asistente?', opts: ['Corriendo un conjunto de casos de evaluación', 'Preguntándole al modelo', 'Mirando el tamaño del prompt', 'No se puede saber'], a: 0, ex: 'Como pruebas automáticas para IA.' },
        ],
      },
    ],
  },

  /* ===================== 21. SERVIR CON FASTAPI ===================== */
  {
    id: 'pyai-api',
    module: M4,
    title: 'Servir tu IA con FastAPI',
    subtitle: 'Una API para tus apps iOS y Android',
    icon: '🚀',
    color: '#009688',
    sources: [FASTAPI, PYDANTIC, link('FastAPI · Server-Sent Events', 'https://fastapi.tiangolo.com/advanced/custom-response/#streamingresponse')],
    intro: 'Tu app de iPhone o Android **no debe** llamar directamente al LLM ni guardar la clave de la API. Lo correcto es un **servidor propio** en medio. **FastAPI** es la forma más rápida de crearlo en Python.',
    reading: [
      {
        h: '¿Por qué un servidor propio?',
        p: 'El servidor guarda la **clave secreta**, aplica **límites de uso** por usuario, registra costos, puede cambiar de modelo sin actualizar la app y ejecuta tus modelos de scikit-learn o PyTorch.',
        diagram: { kind: 'flow', steps: [{ icon: '📱', t: 'App iOS / Android', d: 'sin claves' }, { icon: '🚀', t: 'FastAPI', d: 'clave, límites, lógica' }, { icon: '🤖', t: 'LLM / modelo', d: 'Claude, PyTorch…' }], arrows: ['HTTPS', 'SDK'], caption: 'La app habla con tu API; tu API habla con la IA.' },
      },
      {
        h: 'Tu primera API',
        p: 'Con FastAPI, cada ruta es una función decorada. Los parámetros y cuerpos se describen con **tipos y Pydantic**: FastAPI valida la entrada, convierte a JSON y genera documentación interactiva en `/docs` automáticamente.',
        code: R`# main.py
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="API de recomendaciones")

class Pregunta(BaseModel):
    texto: str
    usuario_id: str

class Respuesta(BaseModel):
    respuesta: str

@app.get("/salud")
def salud():
    return {"ok": True}

@app.post("/preguntar", response_model=Respuesta)
async def preguntar(p: Pregunta) -> Respuesta:
    return Respuesta(respuesta=f"Recibí: {p.texto}")

# uv add "fastapi[standard]"  →  uv run fastapi dev main.py`,
      },
      {
        h: 'Llamar al LLM desde la API',
        p: 'Crea **un solo cliente** al arrancar y úsalo en las rutas con `await`. Valida y limita la entrada antes de gastar tokens.',
        code: R`from anthropic import AsyncAnthropic
from fastapi import HTTPException

cliente = AsyncAnthropic()

@app.post("/preguntar", response_model=Respuesta)
async def preguntar(p: Pregunta) -> Respuesta:
    if len(p.texto) > 2_000:
        raise HTTPException(status_code=413, detail="Pregunta demasiado larga")
    r = await cliente.messages.create(
        model="claude-sonnet-5-5", max_tokens=400,
        messages=[{"role": "user", "content": p.texto}],
    )
    return Respuesta(respuesta=r.content[0].text)`,
      },
      {
        h: 'Streaming hacia la app (SSE)',
        p: 'Para que la app muestre la respuesta mientras se genera, la API reenvía el streaming con **Server-Sent Events**: líneas que empiezan con `data: `. En iOS lo lees con `URLSession.bytes` y en Android con OkHttp o Ktor.',
        code: R`from fastapi.responses import StreamingResponse
import json

@app.post("/preguntar/stream")
async def preguntar_stream(p: Pregunta):
    async def eventos():
        async with cliente.messages.stream(
            model="claude-sonnet-5-5", max_tokens=600,
            messages=[{"role": "user", "content": p.texto}],
        ) as stream:
            async for texto in stream.text_stream:
                yield f"data: {json.dumps({'texto': texto})}\n\n"
        yield "data: [FIN]\n\n"
    return StreamingResponse(eventos(), media_type="text/event-stream")`,
      },
      {
        h: 'Servir tu propio modelo',
        p: 'Carga el modelo **una vez** al arrancar (con `lifespan`) y reutilízalo en cada petición. Así sirves el modelo de scikit-learn que entrenaste antes.',
        code: R`from contextlib import asynccontextmanager
import joblib, pandas as pd

modelos = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    modelos["churn"] = joblib.load("modelo_churn.joblib")   # una sola vez
    yield
    modelos.clear()

app = FastAPI(lifespan=lifespan)

class Cliente(BaseModel):
    edad: int
    visitas: int
    gasto: float
    ciudad: str
    plan: str

@app.post("/riesgo")
def riesgo(c: Cliente):
    prob = modelos["churn"].predict_proba(pd.DataFrame([c.model_dump()]))[0, 1]
    return {"riesgo": round(float(prob), 3)}`,
      },
      {
        h: 'Seguridad y despliegue',
        p: 'Antes de publicar: **autenticación** (tokens de tu app o de tu proveedor de login), **límites de uso** por usuario, **HTTPS**, registros sin datos sensibles y la clave del LLM en variables de entorno del servidor. Para desplegar, empaqueta en un contenedor y súbelo a tu nube favorita.',
        code: R`# Dockerfile mínimo
FROM python:3.15-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev
COPY . .
CMD ["uv", "run", "fastapi", "run", "main.py", "--port", "8000"]`,
      },
    ],
    summary: [
      'Las apps móviles hablan con **tu** API; la API guarda la clave y aplica límites.',
      'FastAPI: rutas como funciones; Pydantic valida; documentación automática en `/docs`.',
      'Usa un cliente `AsyncAnthropic` compartido y `await` en las rutas.',
      'Reenvía el streaming a la app con **Server-Sent Events** (`StreamingResponse`).',
      'Carga tus modelos una vez con `lifespan`.',
      'Autenticación, límites, HTTPS y secretos en variables de entorno antes de publicar.',
    ],
    lessons: [
      {
        title: 'FastAPI',
        questions: [
          { t: 'mc', q: '¿Por qué la app móvil no debe llamar directo al LLM con tu clave?', opts: ['Cualquiera podría extraer la clave de la app', 'Porque es más lento', 'Porque Swift no puede hacer HTTP', 'Porque el LLM no acepta móviles'], a: 0, ex: 'La clave vive solo en tu servidor.' },
          { t: 'mc', q: '¿Qué usa FastAPI para validar el cuerpo de una petición?', opts: ['Modelos de Pydantic', 'Expresiones regulares', 'XML Schema', 'Nada'], a: 0, ex: 'Si los datos no cumplen, responde 422 automáticamente.' },
          { t: 'mc', q: '¿En qué ruta está la documentación interactiva automática?', opts: ['/docs', '/help', '/swagger.json obligatorio', '/readme'], a: 0, ex: 'FastAPI la genera a partir de tus tipos.' },
          { t: 'fill', q: 'Completa el decorador para una ruta POST.', code: R`@app.___("/preguntar")`, opts: ['post', 'route', 'send', 'put_json'], a: 'post', ex: 'También existen `get`, `put`, `delete`…' },
          { t: 'mc', q: '¿Qué comando arranca FastAPI en modo desarrollo con uv?', opts: ['uv run fastapi dev main.py', 'uv serve main', 'python fastapi.py', 'uv start'], a: 0, ex: 'Recarga al guardar cambios.' },
          { t: 'tf', q: 'Una ruta `async def` puede usar `await` para llamar al LLM sin bloquear el servidor.', a: true, ex: 'El servidor atiende otras peticiones mientras tanto.' },
        ],
      },
      {
        title: 'Streaming, modelos y producción',
        questions: [
          { t: 'mc', q: '¿Qué formato se usa para enviar la respuesta en partes a la app?', opts: ['Server-Sent Events (data: …)', 'Un PDF', 'XML', 'Un ZIP'], a: 0, ex: '`media_type="text/event-stream"`.' },
          { t: 'mc', q: '¿Para qué sirve `lifespan` en FastAPI?', opts: ['Ejecutar código al arrancar y al apagar, como cargar modelos', 'Medir el tiempo de vida de una petición', 'Limitar la memoria', 'Programar tareas diarias'], a: 0, ex: 'El modelo se carga una sola vez.' },
          { t: 'mc', q: '¿Qué código HTTP devuelves si la pregunta es demasiado larga?', opts: ['413', '200', '404', '301'], a: 0, ex: 'Payload Too Large.' },
          { t: 'mc', q: '¿Qué hace `c.model_dump()` en un modelo de Pydantic?', opts: ['Lo convierte en diccionario', 'Lo borra', 'Lo valida otra vez', 'Lo guarda en disco'], a: 0, ex: 'Útil para crear un DataFrame.' },
          { t: 'mc', q: '¿Qué NO deberías guardar en los registros (logs) del servidor?', opts: ['Datos sensibles de los usuarios', 'Códigos de estado', 'Tiempos de respuesta', 'Errores'], a: 0, ex: 'Protege la privacidad.' },
          { t: 'tf', q: 'En el Dockerfile, `uv sync --frozen` instala exactamente las versiones de uv.lock.', a: true, ex: 'Construcciones reproducibles.' },
        ],
      },
    ],
  },
]
