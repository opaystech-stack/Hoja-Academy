# -*- coding: utf-8 -*-
"""Passe FR des sections communes + homepage + corrections des melanges FR/ES."""
import re
from pathlib import Path

ROOT = Path(r"C:/LAPOSTE/Projets/clones/academiartificial/app/src/app")

T = {
 # --- corrections des melanges (substitution partielle ES->FR) ---
 "Nuestro curso de Intelligence Artificielle Generativa está diseñado para que domines":
   "Notre cours d'Intelligence Artificielle Générative est conçu pour que vous maîtrisiez",
 "la posibilidad de tramitar un certificado Universitario en Intelligence Artificielle de la Universidad Isabel I":
   "la possibilité d'obtenir un certificat universitaire en Intelligence Artificielle de l'Universidad Isabel I",
 "EN NUESTRO Programa": "DANS NOTRE Programme",
 " en Intelligence Artificielle": " en Intelligence Artificielle",

 # --- hero-section (homepage) ---
 "FORMACIÓN ONLINE": "FORMATION EN LIGNE",
 "Sé parte de él.": "Faites-en partie.",
 "Descubrir el Programa Intensivo": "Découvrir le Programme Intensif",
 "No sigas el cambio.": "Ne suivez pas le changement.",
 "La inteligencia artificial": "L'intelligence artificielle",
 "Está reescribiendo las reglas del mundo.": "réécrit les règles du monde.",
 "Aprende a utilizar la inteligencia artificial de forma práctica y empieza a aplicarla en tu trabajo, tus proyectos y tu día a día.":
   "Apprenez à utiliser l'intelligence artificielle de façon pratique et commencez à l'appliquer à votre travail, vos projets et votre quotidien.",
 'alt="academia de IA"': 'alt="académie IA"',

 # --- el-futuro-est ---
 "El futuro está en tus manos": "L'avenir est entre vos mains",
 "Formación online": "Formation en ligne",
 "adaptada a ti": "adaptée à vous",
 "Acepto recibir emails.": "J'accepte de recevoir des emails.",
 "trabaja con herramientas reales y descubre como aplicarlas en tu trabajo, tus proyectos o tu negocio.":
   "travaillez avec des outils réels et découvrez comment les appliquer à votre travail, vos projets ou votre activité.",
 "Enfocado a resultados reales, no a teoría.": "Orienté vers des résultats réels, pas vers la théorie.",
 "Entender la inteligencia artificial no es cuestión de saber más, sino de tener claridad sobre cómo utilizarla en cada situación.":
   "Comprendre l'intelligence artificielle n'est pas une question de savoir plus, mais d'avoir les idées claires sur la façon de l'utiliser dans chaque situation.",
 "Aquí encontrarás una forma estructurada de abordarla para que realmente tenga sentido en lo que haces.":
   "Vous trouverez ici une approche structurée pour qu'elle ait vraiment du sens dans ce que vous faites.",
 "Suscribirme": "S'abonner",
 "EMPIEZA HOY.": "COMMENCEZ AUJOURD'HUI.",
 "LIDERA MAÑANA.": "DOMINEZ DEMAIN.",
 "Deja de complicarte. Usa la IA a tu favor.": "Arrêtez de vous compliquer la vie. Mettez l'IA à votre service.",
 "DOMINA LAS HERRAMIENTAS QUE": "MAÎTRISEZ LES OUTILS QUI",
 "ya han cambiado la forma de trabajar.": "ont déjà changé la façon de travailler.",

 # --- el-mundo-est ---
 "El mundo está cambiando. ¿Y tú?": "Le monde change. Et vous ?",
 "FÓRMATE EN IA DE FORMA EFICIENTE": "FORMEZ-VOUS À L'IA EFFICACEMENT",
 "Programa Intensivo de IA Generativa": "Programme Intensif d'IA Générative",
 "¿Por qué": "Pourquoi ",
 "Diapositiva anterior": "Diapositive précédente",
 "Diapositiva siguiente": "Diapositive suivante",
 "Ir a la diapositiva": "Aller à la diapositive",
 'alt="Carrusel"': 'alt="Carrousel"',
 "Carrusel": "Carrousel",

 # --- en-solo8 ---
 "En solo 8 semanas, cambiarás tu manera de ver el mundo.": "En seulement 8 semaines, vous changerez votre façon de voir le monde.",
 "de IA Generativa": "d'IA Générative",
 "Ver más información": "Voir plus d'informations",
 "aprenderás a dominar más de 60 herramientas que ya están revolucionando industrias. ¿Qué puedes hacer con IA?":
   "vous apprendrez à maîtriser plus de 60 outils qui révolutionnent déjà des industries. Que pouvez-vous faire avec l'IA ?",
 "Desde imágenes hasta sonidos, vídeos, chatbots, agentes, apps y más.":
   "Des images aux sons, vidéos, chatbots, agents, apps et plus encore.",
 "TÚ DEFINES EL LÍMITE.": "VOUS DÉFINISSEZ LA LIMITE.",
 "Programa Intensivo": "Programme Intensif",

 # --- feature-grid ---
 "CREAR CON IA:": "CRÉER AVEC L'IA :",
 "APLICAR IA EN PROYECTOS REALES": "APPLIQUER L'IA À DES PROJETS RÉELS",
 "DOMINAR +60 HERRAMIENTAS DE IA": "MAÎTRISER +60 OUTILS D'IA",
 "Conocerás IAs generativas especialidas a los casos de uso concreto.":
   "Vous découvrirez des IA génératives spécialisées pour des cas d'usage concrets.",
 "No más ideas abstractas. Lo que aprendas, lo aplicas desde el día uno.":
   "Fini les idées abstraites. Ce que vous apprenez, vous l'appliquez dès le premier jour.",
 "Potencia tu productividad y lleva tus proyectos a un nuevo nivel.":
   "Booster votre productivité et amenez vos projets à un nouveau niveau.",

 # --- feature-grid2 ---
 "Talleres prácticos incluidos": "Ateliers pratiques inclus",
 "puede llegar la IA": "l'IA peut aller",
 "Lo descubrirás en cada taller práctico, donde crearás:": "Vous le découvrirez dans chaque atelier pratique, où vous créerez :",
 "Quiero ver más": "Je veux voir plus",
 "Certificación": "Certification",
 "Al completar el Programa, no solo habrás aprendido. También podrás obtener doble certificación avalada por HOJA ACADEMY y por la Universidad Isabel I.":
   "À la fin du Programme, vous n'aurez pas seulement appris. Vous pourrez aussi obtenir une double certification délivrée par HOJA ACADEMY et l'Universidad Isabel I.",
 "Estarás preparado para marcar la diferencia en cualquier proyecto.": "Vous serez prêt à faire la différence dans n'importe quel projet.",
 "Bonificaciones y beneficios": "Aides et avantages",
 "El Programa Intensivo es bonificable para empresas a través de Fundae. También ofrecemos planes de financiación para pagar en cómodos plazos.":
   "Le Programme Intensif est finançable pour les entreprises via FUNDAE. Nous proposons aussi des plans de financement en paiements échelonnés.",
 "La inversión en tu futuro empieza hoy.": "Votre investissement dans l'avenir commence aujourd'hui.",
 "¿Hasta dónde": "Jusqu'où",

 # --- metodolog ---
 "Metodología propia": "Méthodologie propre",
 "Conocer escuela": "Découvrir l'école",
 "DESCUBRIR": "DÉCOUVRIR",
 "A través de nuestras clases de temario, descubrirás los conceptos clave de la IA Generativa, con un enfoque práctico y directo en las herramientas más avanzadas del sector.":
   "À travers nos cours théoriques, vous découvrirez les concepts clés de l'IA générative, avec une approche pratique et directe sur les outils les plus avancés du secteur.",
 "Al finalizar, recibirás todos los conocimientos de forma rápida y optimizada en solo 8 semanas.":
   "À la fin, vous aurez acquis toutes les connaissances de façon rapide et optimisée en seulement 8 semaines.",
 "te enviaremos una certificación": "nous vous enverrons une certification",
 "ENSAYAR": "S'ENTRAÎNER",
 "CONSEGUIR": "RÉUSSIR",
 "Cada semana, tendrás la oportunidad de poner en práctica lo aprendido en un taller específico, diseñado para aplicar el conocimiento en un caso real de uso.":
   "Chaque semaine, vous mettrez en pratique ce qui a été appris dans un atelier spécifique, conçu pour appliquer le savoir à un cas d'usage réel.",
 "Accederás a una selección de herramientas tecnológicas sin convenios con terceros, todas disponibles en versiones gratuitas para que puedas seguir explorando y profundizando más allá del curso.":
   "Vous accéderez à une sélection d'outils technologiques sans accord avec des tiers, tous disponibles en version gratuite pour continuer à explorer au-delà du cours.",
 'alt="ACADEMIA DE INTELIGENCIA"': 'alt="INSTITUTION DE L\u2019INTELLIGENCE ARTIFICIELLE"',
 "ACADEMIA DE INTELIGENCIA": "INSTITUTION DE L'INTELLIGENCE ARTIFICIELLE",
}

GEN = [
 (r"(\d+) ediciones", r"\1 éditions"),
]

def apply(text):
    for es, fr in T.items():
        text = text.replace(es, fr)
    for pat, rep in GEN:
        text = re.sub(pat, rep, text)
    return text

changed = []
for p in sorted(ROOT.rglob("*.tsx")):
    raw = p.read_text(encoding="utf-8")
    new = apply(raw)
    if new != raw:
        p.write_text(new, encoding="utf-8", newline="\n")
        changed.append(str(p.relative_to(ROOT)))
print(f"{len(changed)} fichiers modifies")
for c in changed: print("  " + c)
