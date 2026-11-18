// Código del ejemplo de la vida real ("Explicado fácil") para el curso de SwiftUI.
export const swiftuiCode = {
  'ui-intro': {
    title: 'Una tarjeta de perfil armada como LEGO',
    src: String.raw`import SwiftUI

@main
struct PerfilApp: App {                        // ① punto de entrada
    var body: some Scene {
        WindowGroup { TarjetaPerfil() }        // ② escena → vista raíz
    }
}

struct TarjetaPerfil: View {
    var body: some View {                      // ③ describe, no ordena pasos
        VStack(spacing: 8) {
            Avatar(inicial: "J")               // ④ piezas pequeñas
            Text("Joel Lozano").font(.title2.bold())
            Button("Seguir") {}.buttonStyle(.borderedProminent)
        }
    }
}

struct Avatar: View {
    let inicial: String
    var body: some View {
        Text(inicial).font(.largeTitle)
            .frame(width: 72, height: 72)
            .background(.orange.gradient, in: .circle)
    }
}

#Preview { TarjetaPerfil() }                   // ⑤`,
    notes: ['① `@main` marca dónde empieza la app.', '② La app tiene escenas (`WindowGroup`) y dentro va la vista raíz.', '③ **Declarativo**: dices qué quieres ver y SwiftUI lo dibuja.', '④ Las vistas son baratas: crea piezas pequeñas como `Avatar` y reutilízalas.', '⑤ `#Preview` la muestra en Xcode mientras escribes.'],
  },
  'ui-layout': {
    title: 'Una burbuja de chat',
    src: String.raw`import SwiftUI

struct BurbujaChat: View {
    let nombre: String
    let mensaje: String

    var body: some View {
        HStack(alignment: .top, spacing: 10) {     // ① lado a lado
            Circle().fill(.blue.gradient)
                .frame(width: 36, height: 36)      // ② tamaño fijo
            VStack(alignment: .leading, spacing: 4) {  // ③ uno sobre otro
                Text(nombre).font(.caption.bold())
                Text(mensaje)
            }
            .padding(12)
            .background(.gray.opacity(0.15), in: .rect(cornerRadius: 16))
            Spacer(minLength: 40)                  // ④ resorte a la derecha
        }
        .padding(.horizontal)                      // ⑤ aire con los bordes
    }
}

#Preview { BurbujaChat(nombre: "Ana", mensaje: "¿Vamos por tacos? 🌮") }`,
    notes: ['① `HStack` pone la foto y el mensaje en fila.', '② `.frame` propone un tamaño fijo para el avatar.', '③ `VStack` con `alignment: .leading` apila nombre y texto alineados a la izquierda.', '④ `Spacer` empuja la burbuja a la izquierda y deja espacio libre.', '⑤ `padding` evita que el contenido toque los bordes de la pantalla.'],
  },
  'ui-modifiers': {
    title: 'Enmarcar una foto: el orden importa',
    src: String.raw`import SwiftUI

struct Marcos: View {
    var body: some View {
        HStack(spacing: 24) {
            Text("📸")
                .font(.system(size: 48))
                .padding(16)                         // ① paspartú primero
                .background(.white)
                .border(.brown, width: 6)            // ② marco después

            Text("📸")
                .font(.system(size: 48))
                .border(.brown, width: 6)            // ③ marco pegado a la foto
                .padding(16)
                .background(.white)
        }
        .padding()
        .background(.gray.opacity(0.2))
    }
}

extension View {                                     // ④ tu propio estilo
    func estiloTarjeta() -> some View {
        padding().background(.background, in: .rect(cornerRadius: 12)).shadow(radius: 4)
    }
}`,
    notes: ['① Primero el espacio blanco (padding + background)…', '② …y luego el marco, que envuelve todo lo anterior.', '③ Al invertir el orden, el marco queda pegado a la foto y el blanco queda afuera.', '④ Una extensión de `View` empaqueta modificadores para reutilizar un estilo en toda la app.'],
  },
  'ui-controls': {
    title: 'Una pantalla de ajustes en minutos',
    src: String.raw`import SwiftUI

struct AjustesView: View {
    @State private var nombre = ""
    @State private var notificaciones = true
    @State private var brillo = 0.6
    @State private var tema = "Sistema"

    var body: some View {
        Form {                                                   // ① aspecto nativo
            Section("Perfil") {
                TextField("Tu nombre", text: $nombre)            // ②
            }
            Section("Preferencias") {
                Toggle("Notificaciones", isOn: $notificaciones)  // ③
                Slider(value: $brillo) { Text("Brillo") }
                Picker("Tema", selection: $tema) {               // ④
                    ForEach(["Claro", "Oscuro", "Sistema"], id: \.self) { Text($0) }
                }
            }
            Button("Guardar") { print("Guardado") }              // ⑤
        }
    }
}`,
    notes: ['① `Form` les da el estilo de la app Ajustes del iPhone.', '② Cada control recibe un **binding** (`$nombre`) para leer y escribir el estado.', '③ `Toggle` es el interruptor y `Slider` la perilla.', '④ `Picker` muestra una lista de opciones; la elegida se guarda en `tema`.', '⑤ `Button` ejecuta una acción al tocarlo.'],
  },
  'ui-state': {
    title: 'Un foco con dos interruptores',
    src: String.raw`import SwiftUI

struct Pasillo: View {
    @State private var encendido = false             // ① una sola fuente de verdad

    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: encendido ? "lightbulb.fill" : "lightbulb")
                .font(.system(size: 60))
                .foregroundStyle(encendido ? .yellow : .gray)
            Interruptor(lugar: "Pasillo", encendido: $encendido)   // ② presta con $
            Interruptor(lugar: "Cuarto", encendido: $encendido)
        }
    }
}

struct Interruptor: View {
    let lugar: String
    @Binding var encendido: Bool                     // ③ no es dueño, solo lo usa

    var body: some View {
        Toggle(lugar, isOn: $encendido)              // ④ escribe en el original
            .padding(.horizontal)
    }
}`,
    notes: ['① `@State` guarda el valor y sobrevive a los redibujos; el padre es el **dueño**.', '② Con `$` se crea un **binding**: un acceso compartido al mismo valor.', '③ `@Binding` no tiene su propia copia: lee y escribe el estado del padre.', '④ Cualquiera de los dos interruptores cambia el **mismo** foco.'],
  },
  'ui-observable': {
    title: 'Un carrito compartido por varias pantallas',
    src: String.raw`import SwiftUI

@Observable
final class Carrito {                                  // ① modelo observable
    var productos: [String] = []
    var total: Double = 0
    @ObservationIgnored var ultimaSincronizacion = Date()   // ② no avisa cambios

    func agregar(_ p: String, precio: Double) { productos.append(p); total += precio }
}

struct TiendaView: View {
    @State private var carrito = Carrito()             // ③ dueño del modelo
    var body: some View {
        VStack {
            IconoCarrito(carrito: carrito)
            Button("Agregar café") { carrito.agregar("Café", precio: 85) }
            NotaPedido(carrito: carrito)
        }
    }
}

struct IconoCarrito: View {
    let carrito: Carrito
    var body: some View { Label("\(carrito.productos.count)", systemImage: "cart") }  // ④
}

struct NotaPedido: View {
    @Bindable var carrito: Carrito                     // ⑤ para crear bindings
    var body: some View { Text("Total: $\(carrito.total, specifier: "%.2f")") }
}`,
    notes: ['① `@Observable` hace que SwiftUI detecte qué propiedades usa cada vista.', '② `@ObservationIgnored` excluye datos que no deben redibujar nada.', '③ Quien crea el modelo lo guarda con `@State`.', '④ Esta vista solo lee `productos`: se actualiza cuando cambian los productos.', '⑤ `@Bindable` permite hacer `$carrito.algo` si necesitas un binding a una propiedad.'],
  },
  'ui-environment': {
    title: 'Modo oscuro, cerrar hojas y tus propios valores',
    src: String.raw`import SwiftUI

extension EnvironmentValues {
    @Entry var moneda: String = "MXN"                  // ① valor propio
}

struct DetalleProducto: View {
    @Environment(\.colorScheme) private var esquema    // ② valor del sistema
    @Environment(\.dismiss) private var cerrar         // ③ acción
    @Environment(\.moneda) private var moneda

    var body: some View {
        VStack {
            Text("Precio: 120 \(moneda)")
            Text(esquema == .dark ? "🌙 Modo oscuro" : "☀️ Modo claro")
            Button("Cerrar") { cerrar() }
        }
    }
}

struct Tienda: View {
    @State private var verDetalle = false
    var body: some View {
        Button("Ver producto") { verDetalle = true }
            .sheet(isPresented: $verDetalle) {
                DetalleProducto()
                    .environment(\.moneda, "USD")      // ④ solo esta rama
            }
    }
}`,
    notes: ['① `@Entry` crea un valor propio que baja por todas las vistas.', '② `colorScheme` dice si el sistema está en claro u oscuro, sin pasarlo a mano.', '③ `dismiss` cierra la pantalla actual desde dentro.', '④ Se puede cambiar un valor **solo para una rama** del árbol de vistas.'],
  },
  'ui-lifecycle': {
    title: 'Un reproductor que carga, pausa y se reinicia',
    src: String.raw`import SwiftUI

struct Reproductor: View {
    let cancionID: Int
    @State private var estado = "Cargando…"
    @Environment(\.scenePhase) private var fase

    var body: some View {
        Text(estado)
            .task(id: cancionID) {                         // ① trabajo ligado a la vista
                try? await Task.sleep(for: .seconds(1))
                estado = "▶️ Reproduciendo canción \(cancionID)"
            }
            .onChange(of: fase) { _, nueva in              // ② la app cambió de fase
                if nueva == .background { estado = "⏸️ En pausa" }
            }
            .onDisappear { print("Saliste del reproductor") }  // ③
    }
}

struct Playlist: View {
    @State private var actual = 1
    var body: some View {
        VStack {
            Reproductor(cancionID: actual)
                .id(actual)                                // ④ nueva identidad = estado nuevo
            Button("Siguiente") { actual += 1 }
        }
    }
}`,
    notes: ['① `.task` empieza al aparecer la vista y **se cancela solo** al desaparecer; con `id:` se reinicia si cambia la canción.', '② `scenePhase` avisa si la app pasa a segundo plano.', '③ `onDisappear` se ejecuta al salir de la pantalla.', '④ `.id()` cambia la identidad: SwiftUI trata la vista como nueva y reinicia su `@State`.'],
  },
  'ui-lists': {
    title: 'Una bandeja de correo',
    src: String.raw`import SwiftUI

struct Correo: Identifiable {                         // ① id único
    let id = UUID()
    let asunto: String
}

struct BandejaView: View {
    @State private var correos = [Correo(asunto: "Factura"), Correo(asunto: "Promoción")]
    @State private var busqueda = ""

    var filtrados: [Correo] {
        busqueda.isEmpty ? correos : correos.filter { $0.asunto.localizedCaseInsensitiveContains(busqueda) }
    }

    var body: some View {
        NavigationStack {
            List {
                ForEach(filtrados) { Text($0.asunto) }
                    .onDelete { correos.remove(atOffsets: $0) }  // ② deslizar para borrar
            }
            .overlay {
                if filtrados.isEmpty {
                    ContentUnavailableView("Bandeja vacía", systemImage: "tray")  // ③
                }
            }
            .searchable(text: $busqueda)                     // ④ barra de búsqueda
            .refreshable { try? await Task.sleep(for: .seconds(1)) }  // ⑤ jalar para recargar
            .navigationTitle("Correo")
        }
    }
}`,
    notes: ['① `Identifiable` da un id único para que la lista sepa qué fila es cuál.', '② `.onDelete` agrega el gesto de deslizar para borrar.', '③ Un estado vacío amable cuando no hay resultados.', '④ `.searchable` pone la barra de búsqueda arriba.', '⑤ `.refreshable` agrega el “jalar hacia abajo”.'],
  },
  'ui-navigation': {
    title: 'Una tienda con “volver al inicio”',
    src: String.raw`import SwiftUI

enum Ruta: Hashable {                                  // ① destinos posibles
    case categoria(String)
    case producto(String)
}

struct TiendaView: View {
    @State private var ruta: [Ruta] = []               // ② la pila de cartas

    var body: some View {
        NavigationStack(path: $ruta) {
            List(["Ropa", "Zapatos"], id: \.self) { c in
                NavigationLink(c, value: Ruta.categoria(c))    // ③ navegar con datos
            }
            .navigationDestination(for: Ruta.self) { destino in
                switch destino {
                case .categoria(let c):
                    NavigationLink("Playera azul", value: Ruta.producto("\(c): Playera azul"))
                case .producto(let p):
                    Button("Comprar \(p)") { ruta.removeAll() }   // ④ de vuelta al inicio
                }
            }
            .navigationTitle("Tienda")
        }
    }
}`,
    notes: ['① Un `enum` describe a dónde se puede ir.', '② La **ruta** es un array en el estado: cada elemento es una pantalla apilada.', '③ `NavigationLink(value:)` apila un dato y `.navigationDestination` decide qué vista mostrar.', '④ Vaciar la ruta regresa al inicio de un jalón (útil tras comprar).'],
  },
  'ui-presentation': {
    title: 'Confirmar antes de borrar una foto',
    src: String.raw`import SwiftUI

struct FotoView: View {
    @State private var confirmar = false
    @State private var mostrarInfo = false
    @State private var borrada = false

    var body: some View {
        Image(systemName: borrada ? "photo.badge.exclamationmark" : "photo")
            .font(.system(size: 80))
            .toolbar {                                          // ① botones en la barra
                Button("Info", systemImage: "info.circle") { mostrarInfo = true }
                Button("Borrar", systemImage: "trash", role: .destructive) { confirmar = true }
            }
            .confirmationDialog("¿Eliminar foto?", isPresented: $confirmar,  // ②
                                titleVisibility: .visible) {
                Button("Eliminar", role: .destructive) { borrada = true }
                Button("Cancelar", role: .cancel) {}
            }
            .sheet(isPresented: $mostrarInfo) {                 // ③ hoja que sube
                Text("Tomada en Oaxaca · 12 MB")
                    .presentationDetents([.medium])             // ④ media pantalla
            }
    }
}`,
    notes: ['① `.toolbar` coloca botones en la barra de navegación de forma nativa.', '② `confirmationDialog` pide confirmar algo que no se puede deshacer.', '③ `.sheet` aparece cuando el `Bool` es `true` y se cierra al volver a `false`.', '④ `presentationDetents` hace que la hoja ocupe solo media pantalla.'],
  },
  'ui-animation': {
    title: 'El producto que “vuela” al carrito',
    src: String.raw`import SwiftUI

struct AgregarAlCarrito: View {
    @Namespace private var espacio                        // ① para el efecto héroe
    @State private var enCarrito = false
    @State private var cantidad = 0

    var body: some View {
        VStack(spacing: 40) {
            HStack {
                Spacer()
                ZStack {
                    Image(systemName: "cart").font(.largeTitle)
                    if enCarrito {
                        Text("☕").matchedGeometryEffect(id: "producto", in: espacio)  // ②
                    }
                }
                Text("\(cantidad)").contentTransition(.numericText())   // ③
            }
            if !enCarrito {
                Text("☕").font(.system(size: 80))
                    .matchedGeometryEffect(id: "producto", in: espacio)
            }
            Button("Agregar") {
                withAnimation(.spring(duration: 0.6)) {   // ④ anima todo el cambio
                    enCarrito = true
                    cantidad += 1
                }
            }
        }
        .padding()
    }
}`,
    notes: ['① `@Namespace` crea un espacio para conectar dos vistas como si fueran la misma.', '② Mismo `id` en ambos lugares: SwiftUI mueve la taza del centro al carrito.', '③ El número cambia con una transición de dígitos.', '④ `withAnimation`: tú cambias el estado y SwiftUI dibuja el movimiento intermedio.'],
  },
  'ui-graphics': {
    title: 'La gráfica de pasos de la semana',
    src: String.raw`import SwiftUI

struct GraficaPasos: View {
    let pasos: [Double] = [4_000, 7_500, 6_200, 9_800, 8_100]

    var body: some View {
        GeometryReader { geo in                         // ① mide el espacio
            let maximo = pasos.max() ?? 1
            Path { path in                              // ② dibuja punto por punto
                for (i, valor) in pasos.enumerated() {
                    let x = geo.size.width * CGFloat(i) / CGFloat(pasos.count - 1)
                    let y = geo.size.height * (1 - valor / maximo)     // ③ arriba = más pasos
                    i == 0 ? path.move(to: CGPoint(x: x, y: y))
                           : path.addLine(to: CGPoint(x: x, y: y))
                }
            }
            .stroke(.green, style: StrokeStyle(lineWidth: 4, lineCap: .round, lineJoin: .round))  // ④
        }
        .frame(height: 160)
        .padding()
        .background(Circle().fill(.green.opacity(0.08)).padding(-40))  // ⑤ forma lista
    }
}`,
    notes: ['① `GeometryReader` da el ancho y alto disponibles.', '② `Path` dibuja la línea uniendo coordenadas.', '③ En pantalla, la `y` crece hacia abajo; por eso invertimos el valor.', '④ `.stroke` traza el contorno con grosor y bordes redondeados.', '⑤ Las formas como `Circle` están listas para usarse como fondo.'],
  },
  'ui-architecture': {
    title: 'Una app de notas con SwiftData',
    src: String.raw`import SwiftUI
import SwiftData

@Model
final class Nota {                                         // ① se guarda solo
    var texto: String
    var fecha: Date
    init(texto: String, fecha: Date = .now) { self.texto = texto; self.fecha = fecha }
}

@main
struct NotasApp: App {
    var body: some Scene {
        WindowGroup { NotasView() }
            .modelContainer(for: Nota.self)                 // ② el archivero
    }
}

struct NotasView: View {
    @Query(sort: \Nota.fecha, order: .reverse) private var notas: [Nota]  // ③
    @Environment(\.modelContext) private var contexto

    var body: some View {
        List(notas) { Text($0.texto) }
            .overlay { if notas.isEmpty { ContentUnavailableView("Sin notas", systemImage: "note") } }
            .toolbar {
                Button("Nueva", systemImage: "plus") {
                    contexto.insert(Nota(texto: "Idea #\(notas.count + 1)"))   // ④
                }
            }
    }
}

#Preview {
    NotasView().modelContainer(for: Nota.self, inMemory: true)   // ⑤
}`,
    notes: ['① `@Model` convierte la clase en algo que se guarda en el dispositivo.', '② `.modelContainer` prepara el almacenamiento para toda la app.', '③ `@Query` trae las notas ordenadas y **se actualiza sola** cuando cambian.', '④ Con el `modelContext` insertas; la lista aparece al instante sin recargar.', '⑤ En la preview usamos una base en memoria para no tocar datos reales.'],
  },
  'ui-pro': {
    title: 'Un botón accesible con letra que crece',
    src: String.raw`import SwiftUI
import MapKit

struct BotonFavorito: View {
    @Binding var favorito: Bool
    var body: some View {
        Button { favorito.toggle() } label: {
            Image(systemName: favorito ? "heart.fill" : "heart")
                .font(.title)                                    // ① estilo que respeta Dynamic Type
        }
        .accessibilityLabel("Favorito")                          // ② qué es
        .accessibilityValue(favorito ? "Activado" : "Desactivado")  // ③ cómo está
    }
}

struct FilaRestaurante: View {
    var body: some View {
        HStack {
            Text("🌮 Taquería El Güero").font(.body)
            Text("⭐️ 4.8").font(.caption)
        }
        .accessibilityElement(children: .combine)                // ④ se lee como una sola frase
    }
}

struct MapaUIKit: UIViewRepresentable {                         // ⑤ UIKit dentro de SwiftUI
    func makeUIView(context: Context) -> MKMapView { MKMapView() }
    func updateUIView(_ mapa: MKMapView, context: Context) {}
}`,
    notes: ['① Usar `.title` o `.body` (no tamaños fijos) hace que el texto crezca con Dynamic Type.', '② VoiceOver dirá “Favorito” en vez de “heart fill”.', '③ El **valor** dice el estado actual del botón.', '④ Agrupar evita que VoiceOver lea cada pedacito por separado.', '⑤ `UIViewRepresentable` envuelve una vista de UIKit para usarla en SwiftUI.'],
  },
}
