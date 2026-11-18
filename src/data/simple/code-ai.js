// Código del ejemplo de la vida real ("Explicado fácil") para el curso de IA para iOS.
export const aiCode = {
  'ai-intro': {
    title: 'Reglas escritas a mano vs. modelo que aprendió',
    src: String.raw`// ① Programación tradicional: TÚ escribes las reglas
func esSpamConReglas(_ correo: String) -> Bool {
    let palabras = ["gratis", "premio", "urgente"]
    return palabras.contains { correo.lowercased().contains($0) }
}

// ② Machine Learning: el modelo APRENDIÓ las reglas con ejemplos
import NaturalLanguage

func esSpamConModelo(_ correo: String) throws -> Bool {
    let url = Bundle.main.url(forResource: "DetectorSpam", withExtension: "mlmodelc")!
    let modelo = try NLModel(contentsOf: url)          // ③ entrenado antes (Create ML)
    return modelo.predictedLabel(for: correo) == "spam"  // ④ inferencia
}`,
    notes: ['① Con reglas fijas, un spam que no use esas palabras se te escapa.', '② Con ML, el modelo vio miles de correos etiquetados y descubrió los patrones solo.', '③ El **entrenamiento** ya ocurrió (lento, una vez); aquí solo cargamos el resultado.', '④ La **inferencia** es contestar el examen: rápido, cada vez que llega un correo.'],
  },
  'ai-learning': {
    title: 'Un modelo de precios que aprende solo',
    src: String.raw`// Datos: metros cuadrados (feature) → precio en millones (label)
let ejemplos: [(metros: Double, precio: Double)] = [(50, 1.0), (80, 1.6), (120, 2.4)]

var peso = 0.0                     // ① lo que el modelo va a aprender
let pasito = 0.0001                // ② tasa de aprendizaje

for _ in 1...1_000 {               // ③ muchas rondas de práctica
    var gradiente = 0.0
    for e in ejemplos {
        let prediccion = peso * e.metros
        let error = prediccion - e.precio       // ④ qué tan lejos quedó
        gradiente += 2 * error * e.metros
    }
    peso -= pasito * gradiente / Double(ejemplos.count)  // ⑤ baja la montaña
}
print(peso * 100)   // ≈ 2.0 → una casa de 100 m² vale ~2 millones`,
    notes: ['① El **peso** empieza en 0: el modelo no sabe nada.', '② La **tasa de aprendizaje** es el tamaño de cada pasito.', '③ Repetir muchas veces es “practicar”.', '④ El **error** compara la predicción con la respuesta real; la pérdida mide su tamaño.', '⑤ **Descenso de gradiente**: movemos el peso en la dirección que reduce el error.'],
  },
  'ai-terms': {
    title: 'Palabras cercanas en el mapa de significados',
    src: String.raw`import NaturalLanguage

let embedding = NLEmbedding.wordEmbedding(for: .spanish)!   // ①

let cerca = embedding.distance(between: "perro", and: "gato")    // ②
let lejos = embedding.distance(between: "perro", and: "avión")
print(cerca < lejos)    // true

embedding.enumerateNeighbors(for: "playa", maximumCount: 3) { vecino, _ in  // ③
    print(vecino)       // mar, arena, costa…
    return true
}

let frase = "Me encanta programar en Swift"
let tokenizador = NLTokenizer(unit: .word)                  // ④
tokenizador.string = frase
print(tokenizador.tokens(for: frase.startIndex..<frase.endIndex).count)  // 5`,
    notes: ['① Apple incluye **embeddings** de palabras listos para usar.', '② La distancia en el mapa: “perro” y “gato” quedan más cerca que “perro” y “avión”.', '③ Los **vecinos** son las palabras con significado parecido.', '④ Un **tokenizador** corta el texto en pedacitos (aquí, por palabras).'],
  },
  'ai-mobile': {
    title: 'Híbrido: local para lo fácil, nube para lo difícil',
    src: String.raw`protocol Traductor {                                    // ①
    func traducir(_ texto: String) async throws -> String
}

struct TraductorLocal: Traductor {                      // ② rápido, privado, offline
    func traducir(_ texto: String) async throws -> String { "…traducción local…" }
}
struct TraductorNube: Traductor {                       // ③ más potente
    func traducir(_ texto: String) async throws -> String { "…traducción de la nube…" }
}

struct TraductorHibrido: Traductor {
    let local: Traductor, nube: Traductor
    let hayInternet: () -> Bool

    func traducir(_ texto: String) async throws -> String {
        if texto.count < 200 || !hayInternet() {         // ④
            return try await local.traducir(texto)
        }
        return try await nube.traducir(texto)
    }
}`,
    notes: ['① Un protocolo común permite intercambiar el motor sin cambiar la app.', '② En el dispositivo: sin internet y sin que los datos salgan del teléfono.', '③ En la nube: modelos más grandes para textos largos o difíciles.', '④ La regla híbrida: lo corto o sin conexión se resuelve local; lo largo, en la nube.'],
  },
  'ai-coreml': {
    title: 'Identificar una planta con Core ML',
    src: String.raw`import CoreML
import UIKit

func identificarPlanta(_ foto: UIImage) throws -> String {
    let config = MLModelConfiguration()
    config.computeUnits = .all                             // ① CPU + GPU + Neural Engine
    let modelo = try ClasificadorPlantas(configuration: config)  // ② clase generada por Xcode

    guard let buffer = foto.pixelBuffer(ancho: 224, alto: 224) else {  // ③
        return "Foto inválida"
    }
    let resultado = try modelo.prediction(image: buffer)   // ④
    return resultado.classLabel                            // "Monstera"
}
// pixelBuffer(ancho:alto:) es una extensión auxiliar que redimensiona la foto.`,
    notes: ['① Dejamos que Core ML use todo el chip de Apple para ir más rápido.', '② Al arrastrar el `.mlpackage` a Xcode, se genera una clase de Swift con el nombre del modelo.', '③ El modelo espera imágenes de un tamaño concreto (224×224).', '④ La predicción ocurre **en el iPhone**, sin internet.'],
  },
  'ai-createml': {
    title: 'Entrenar el reconocedor de panes desde código',
    src: String.raw`import CreateML
import Foundation

let carpeta = URL(fileURLWithPath: "/Users/joel/Panes")   // ① Panes/concha, Panes/bolillo…

let datos = MLImageClassifier.DataSource.labeledDirectories(at: carpeta)  // ②
let clasificador = try MLImageClassifier(trainingData: datos)  // ③ transfer learning

let evaluacion = clasificador.evaluation(on: datos)       // ④
print("Error: \(evaluacion.classificationError)")

try clasificador.write(to: URL(fileURLWithPath: "/Users/joel/ReconocePan.mlmodel"))  // ⑤`,
    notes: ['① Cada subcarpeta es una categoría: el nombre de la carpeta es la etiqueta.', '② Create ML lee las fotos y sus etiquetas directamente de las carpetas.', '③ Entrena aprovechando un modelo que ya sabe “ver” (transfer learning): bastan pocas fotos.', '④ Evaluamos antes de publicar (lo ideal es usar fotos que el modelo no vio).', '⑤ Guardamos el modelo listo para arrastrarlo a la app.'],
  },
  'ai-vision': {
    title: 'Leer el ticket del restaurante (OCR)',
    src: String.raw`import Vision
import UIKit

func leerTicket(_ foto: UIImage) throws -> [String] {
    guard let imagen = foto.cgImage else { return [] }
    let solicitud = VNRecognizeTextRequest()           // ① pedir reconocer texto
    solicitud.recognitionLanguages = ["es-MX"]
    solicitud.recognitionLevel = .accurate

    try VNImageRequestHandler(cgImage: imagen).perform([solicitud])  // ②
    let lineas = solicitud.results?.compactMap {
        $0.topCandidates(1).first?.string              // ③ la mejor lectura
    } ?? []
    return lineas.filter { $0.localizedCaseInsensitiveContains("total") }  // ④
}`,
    notes: ['① Vision trae una solicitud lista para **OCR**: no hay que entrenar nada.', '② El análisis ocurre en el dispositivo, rápido y privado.', '③ Por cada línea detectada, tomamos el candidato más probable.', '④ Nos quedamos con las líneas que mencionan el total.'],
  },
  'ai-prompting': {
    title: 'Un buen encargo: rol, tarea, formato y ejemplo',
    src: String.raw`// ① rol (system) · ② formato esperado · ③ ejemplo (few-shot)
let instrucciones = """
Eres un chef mexicano amable.
Responde SOLO en JSON con este formato:
{"platillo": String, "minutos": Int, "ingredientes": [String]}
Ejemplo:
{"platillo": "Molletes", "minutos": 15, "ingredientes": ["bolillo", "frijoles", "queso"]}
"""

let pedido = "Algo vegetariano para 4 personas en menos de 30 minutos."  // ④ user

struct Receta: Decodable {                         // ⑤ leer la respuesta con código
    let platillo: String
    let minutos: Int
    let ingredientes: [String]
}
// let receta = try JSONDecoder().decode(Receta.self, from: respuesta)`,
    notes: ['① El **rol** fija el tono y el conocimiento del modelo.', '② Pedir un **formato estructurado** permite usar la respuesta en la app.', '③ Un **ejemplo** de respuesta mejora muchísimo la calidad.', '④ El mensaje del usuario dice qué quiere, con restricciones claras.', '⑤ Como la salida es JSON, la convertimos en un struct de Swift.'],
  },
  'ai-apis': {
    title: 'Recibir la respuesta palabra por palabra (streaming)',
    src: String.raw`import Foundation

func preguntar(_ texto: String) -> AsyncThrowingStream<String, Error> {
    AsyncThrowingStream { continuation in
        Task {
            var peticion = URLRequest(url: URL(string: "https://mi-servidor.com/chat")!)  // ①
            peticion.httpMethod = "POST"
            peticion.httpBody = try JSONEncoder().encode(["prompt": texto])

            let (bytes, _) = try await URLSession.shared.bytes(for: peticion)  // ②
            for try await linea in bytes.lines where linea.hasPrefix("data: ") {  // ③
                continuation.yield(String(linea.dropFirst(6)))   // ④
            }
            continuation.finish()
        }
    }
}
// En SwiftUI: for try await trozo in preguntar("Hola") { respuesta += trozo }`,
    notes: ['① Llamamos a **tu servidor**, que guarda la clave secreta del LLM; la app nunca la conoce.', '② `bytes(for:)` abre la conexión y va entregando datos conforme llegan.', '③ En **Server-Sent Events**, cada pedazo viene en una línea que empieza con `data: `.', '④ `yield` entrega cada pedacito a la interfaz para mostrarlo al instante.'],
  },
  'ai-slm': {
    title: 'Revisar la memoria antes de cargar un modelo pequeño',
    src: String.raw`import Foundation

struct ModeloLocal {
    let nombre: String
    let tamanoGB: Double
}

func puedoCargar(_ modelo: ModeloLocal) -> Bool {
    let disponibleGB = Double(os_proc_available_memory()) / 1_073_741_824  // ①
    let margen = 1.5                                                        // ②
    return modelo.tamanoGB * margen < disponibleGB
}

let resumidor = ModeloLocal(nombre: "Resumidor-3B-4bit", tamanoGB: 1.8)   // ③
if puedoCargar(resumidor) {
    print("✅ Cargando \(resumidor.nombre) en el dispositivo")
} else {
    print("☁️ Poca memoria: usar la versión en la nube")                    // ④
}`,
    notes: ['① `os_proc_available_memory()` dice cuánta memoria puede usar la app ahora mismo.', '② Dejamos margen: el modelo necesita más memoria al trabajar que lo que pesa en disco.', '③ Un modelo de 3 mil millones de parámetros **cuantizado a 4 bits** pesa menos de 2 GB.', '④ Si no cabe, usamos un plan B en lugar de que el sistema cierre la app.'],
  },
  'ai-fm': {
    title: 'Itinerario de viaje con Foundation Models',
    src: String.raw`import FoundationModels

@Generable                                        // ① molde de la respuesta
struct Itinerario {
    @Guide(description: "Un título corto y atractivo")
    let titulo: String
    @Guide(description: "Exactamente un plan por día", .count(3))
    let dias: [String]
}

func planear() async throws -> Itinerario {
    let sesion = LanguageModelSession(            // ② sesión con instrucciones
        instructions: "Eres un experto en viajes por México. Sé breve."
    )
    let respuesta = try await sesion.respond(     // ③
        to: "Planea 3 días en Oaxaca",
        generating: Itinerario.self
    )
    return respuesta.content                      // ④ un Itinerario de Swift
}`,
    notes: ['① `@Generable` le dice al modelo la forma exacta de la respuesta; `@Guide` da pistas por campo.', '② La **sesión** guarda la conversación y las instrucciones fijan el comportamiento.', '③ Todo ocurre en el iPhone: privado, gratis y sin internet.', '④ No hay que leer texto ni JSON: recibes un struct listo para mostrar.'],
  },
  'ai-fm-next': {
    title: 'Examinar a tu IA con casos de prueba',
    src: String.raw`import Testing

struct CasoRecibo {                    // ① un caso del "examen"
    let texto: String
    let totalEsperado: Double
}

let examen = [
    CasoRecibo(texto: "Tacos 120\nAgua 30\nTOTAL 150", totalEsperado: 150),
    CasoRecibo(texto: "Comida $480.50 Total: $480.50", totalEsperado: 480.5),
]

@Test(arguments: examen)               // ②
func extraeElTotal(caso: CasoRecibo) async throws {
    let total = try await ExtractorDeRecibos().total(de: caso.texto)  // ③
    #expect(total == caso.totalEsperado)
}
// Si cambias el prompt o el modelo, corres el examen: ④ si baja la calificación, lo sabes antes de publicar.`,
    notes: ['① Cada caso trae una entrada y la respuesta correcta, como un examen con su clave.', '② La prueba se repite con cada caso del examen.', '③ `ExtractorDeRecibos` es tu función que usa el modelo (local, PCC o multimodal con la foto).', '④ Esa es la idea de **Evaluations**: medir la calidad cada vez que algo cambia.'],
  },
  'ai-arch': {
    title: 'La IA detrás de un contrato, con estados claros',
    src: String.raw`import SwiftUI

protocol Resumidor { func resumir(_ texto: String) async throws -> String }  // ①

@MainActor @Observable
final class ResumenModel {
    enum Estado { case inicio, cargando, listo(String), error(String) }      // ②
    var estado: Estado = .inicio
    private let ia: Resumidor
    init(ia: Resumidor) { self.ia = ia }                                     // ③

    func resumir(_ texto: String) async {
        estado = .cargando
        do { estado = .listo(try await ia.resumir(texto)) }                  // ④
        catch { estado = .error("No se pudo resumir") }
    }
}
// La vista solo hace: switch model.estado { case .cargando: ProgressView() … }`,
    notes: ['① La app depende de un **protocolo**, no de un modelo específico.', '② Un `enum` de estados evita mostrar “cargando” y “error” al mismo tiempo.', '③ La implementación real (o una falsa para pruebas) se inyecta desde afuera.', '④ `await` deja la pantalla libre mientras la IA trabaja.'],
  },
  'ai-privacy': {
    title: 'Pedir permiso antes de mandar datos a una IA externa',
    src: String.raw`import SwiftUI

struct ResumenSintomasView: View {
    @AppStorage("permisoIAExterna") private var permiso = false   // ①
    @State private var mostrarAviso = false
    let enviar: () -> Void

    var body: some View {
        Button("Resumir con IA") {
            permiso ? enviar() : (mostrarAviso = true)             // ②
        }
        .alert("¿Compartir tus datos?", isPresented: $mostrarAviso) {
            Button("Permitir") { permiso = true; enviar() }        // ③
            Button("No, gracias", role: .cancel) {}
        } message: {
            Text("Tus síntomas se enviarán a ProveedorIA para generar el resumen. No se usarán para entrenar modelos.")  // ④
        }
    }
}`,
    notes: ['① Guardamos la decisión del usuario para no preguntar cada vez.', '② Sin permiso, **no se envía nada**: primero se muestra el aviso.', '③ Solo con un “Permitir” explícito se comparten los datos (regla 5.1.2(i)).', '④ El aviso dice **qué** datos, **a quién** y **para qué**.'],
  },
}
