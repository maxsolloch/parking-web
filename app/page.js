"use client";
import { useState, useEffect, useRef, useCallback } from "react";

export default function Home() {
  const [searchLocation, setSearchLocation] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Load Google Maps script
  useEffect(() => {
    if (window.google) { setMapLoaded(true); return; }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 50.0755, lng: 14.4378 },
      zoom: 13,
      styles: [
        { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
        { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
        { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
        { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9e8f9" }] },
        { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
      ],
      disableDefaultUI: true,
      zoomControl: true,
    });
  }, [mapLoaded]);

  // Geocode address and move map
  const geocodeAddress = useCallback((address) => {
    if (!mapLoaded || !window.google || !address.trim()) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: address + ", Czech Republic" }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        mapInstanceRef.current.panTo(location);
        mapInstanceRef.current.setZoom(15);
        if (markerRef.current) markerRef.current.setMap(null);
        markerRef.current = new window.google.maps.Marker({
          position: location,
          map: mapInstanceRef.current,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#F97316",
            fillOpacity: 1,
            strokeColor: "#fff",
            strokeWeight: 2,
          },
        });
      }
    });
  }, [mapLoaded]);

  // Debounce search
  useEffect(() => {
    if (!searchLocation) return;
    clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      geocodeAddress(searchLocation);
    }, 600);
    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchLocation, geocodeAddress]);

  return (
    <main className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .nav-link { text-decoration: none; color: #57534E; font-size: 15px; transition: color 0.2s; }
        .nav-link:hover { color: #F97316; }
        .btn-primary { background: #F97316; color: white; border: none; border-radius: 10px; padding: 12px 24px; font-size: 15px; font-weight: 500; cursor: pointer; transition: background 0.2s, transform 0.1s; font-family: 'DM Sans', sans-serif; }
        .btn-primary:hover { background: #EA6C0A; transform: translateY(-1px); }
        .btn-secondary { background: transparent; color: #1C1917; border: 1.5px solid #E7E5E4; border-radius: 10px; padding: 12px 24px; font-size: 15px; font-weight: 500; cursor: pointer; transition: border-color 0.2s; font-family: 'DM Sans', sans-serif; }
        .btn-secondary:hover { border-color: #F97316; color: #F97316; }
        .feature-card { background: #FAFAF9; border: 1px solid #F5F5F4; border-radius: 16px; padding: 28px; transition: transform 0.2s, box-shadow 0.2s; }
        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
        .review-card { background: white; border: 1px solid #F5F5F4; border-radius: 16px; padding: 24px; transition: transform 0.2s; }
        .review-card:hover { transform: translateY(-2px); }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeInUp 0.6s ease forwards; }
        .fade-in-2 { animation: fadeInUp 0.6s ease 0.15s forwards; opacity: 0; }
        .fade-in-3 { animation: fadeInUp 0.6s ease 0.3s forwards; opacity: 0; }
        .map-pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #F5F5F4", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/logo_uvod.png" alt="Parketix logo" style={{ height: "40px", width: "auto" }} />
        </div>
        <div style={{ display: "flex", gap: "32px" }}>
          <a href="#" className="nav-link">Najít místo</a>
          <a href="/pronajmout" className="nav-link">Pronajmout místo</a>
          <a href="#jak-to-funguje" className="nav-link">Jak to funguje</a>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn-secondary" style={{ padding: "9px 20px", fontSize: "14px" }}>Přihlásit se</button>
          <button className="btn-primary" style={{ padding: "9px 20px", fontSize: "14px" }}>Registrovat</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: "linear-gradient(160deg, #FFF7ED 0%, #FFEDD5 50%, #FEF3C7 100%)", padding: "64px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 360, height: 360, borderRadius: "50%", background: "rgba(249,115,22,0.07)", pointerEvents: "none" }} />

        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center" }}>
          {/* Left */}
          <div>
            <div className="fade-in" style={{ display: "inline-block", background: "rgba(249,115,22,0.1)", color: "#C2410C", fontSize: "13px", fontWeight: "500", borderRadius: "20px", padding: "5px 14px", marginBottom: "20px", border: "1px solid rgba(249,115,22,0.2)" }}>
              ✦ Více než 1 200 parkovacích míst po celé ČR
            </div>
            <h1 className="fade-in-2" style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(32px, 4vw, 52px)", color: "#1C1917", lineHeight: "1.15", marginBottom: "18px", letterSpacing: "-1px" }}>
              Najdi parkovací místo<br />
              <span style={{ color: "#F97316" }}>kdekoliv v České republice</span>
            </h1>
            <p className="fade-in-3" style={{ fontSize: "16px", color: "#78716C", lineHeight: "1.7", marginBottom: "28px", maxWidth: "460px" }}>
              Pronajímejte soukromá parkovací místa od majitelů ve vašem okolí. Jednoduše, bezpečně a levněji než klasická parkoviště.
            </p>
            {/* Search */}
            <div className="fade-in-3" style={{ background: "white", borderRadius: "14px", padding: "8px 8px 8px 18px", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", marginBottom: "24px" }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                <path d="M10 2C6.68 2 4 4.68 4 8c0 4.5 6 10 6 10s6-5.5 6-10c0-3.32-2.68-6-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z" fill="#F97316"/>
              </svg>
              <input
                style={{ flex: 1, border: "none", outline: "none", fontSize: "15px", color: "#1C1917", background: "transparent", fontFamily: "'DM Sans', sans-serif" }}
                placeholder="Město, ulice nebo PSČ..."
                value={searchLocation}
                onChange={e => setSearchLocation(e.target.value)}
                onKeyDown={e => e.key === "Enter" && geocodeAddress(searchLocation)}
              />
              <button className="btn-primary" onClick={() => geocodeAddress(searchLocation)}>Hledat místo</button>
            </div>
            {/* Stats */}
            <div style={{ display: "flex", gap: "32px" }}>
              {[{ num: "1 200+", label: "míst k pronájmu" }, { num: "8 500+", label: "spokojených řidičů" }, { num: "4.8 ★", label: "průměrné hodnocení" }].map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: "20px", fontWeight: "600", color: "#1C1917", fontFamily: "'DM Serif Display', serif" }}>{s.num}</div>
                  <div style={{ fontSize: "13px", color: "#9CA3AF" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Map */}
          <div style={{ position: "relative", borderRadius: "20px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", height: "420px", background: "#e8e8e8" }}>
            <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
            {!mapLoaded && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5", flexDirection: "column", gap: "12px" }}>
                <div className="map-pulse" style={{ fontSize: "32px" }}>🗺️</div>
                <div style={{ fontSize: "14px", color: "#9CA3AF" }}>Načítání mapy...</div>
              </div>
            )}
            <div style={{ position: "absolute", top: "12px", left: "12px", background: "white", borderRadius: "10px", padding: "8px 14px", fontSize: "13px", fontWeight: "500", color: "#1C1917", boxShadow: "0 2px 12px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22C55E" }} />
              {searchLocation ? `Hledám: ${searchLocation}` : "Zadej adresu pro vyhledání"}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "72px 32px", background: "#fff" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ fontSize: "12px", color: "#F97316", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Proč Parketix</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "34px", color: "#1C1917", marginBottom: "40px", letterSpacing: "-0.5px" }}>Parkování bez starostí</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {[
              { icon: "🗺️", title: "Mapa v reálném čase", desc: "Interaktivní mapa zobrazuje dostupná místa s cenami a fotkami přímo v okolí vaší destinace." },
              { icon: "⚡", title: "Okamžitá rezervace", desc: "Zarezervujte místo na hodiny, dny nebo celý měsíc. Potvrzení dostanete do pár vteřin." },
              { icon: "🔐", title: "Bezpečná platba", desc: "Platíte kartou přes zabezpečenou platební bránu. Peníze putují k majiteli až po parkování." },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div style={{ fontSize: "28px", marginBottom: "14px" }}>{f.icon}</div>
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1C1917", marginBottom: "8px" }}>{f.title}</h3>
                <p style={{ fontSize: "14px", color: "#78716C", lineHeight: "1.7" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="jak-to-funguje" style={{ padding: "72px 32px", background: "#FFF7ED" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ fontSize: "12px", color: "#F97316", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Jak to funguje</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "34px", color: "#1C1917", marginBottom: "48px", letterSpacing: "-0.5px" }}>Za 3 minuty máte místo zajištěné</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {[
              { n: "1", title: "Zadejte destinaci", desc: "Napište město nebo adresu kam jedete" },
              { n: "2", title: "Vyberte místo", desc: "Prohlédněte fotky, ceny a recenze" },
              { n: "3", title: "Zaplaťte online", desc: "Rychlá platba kartou nebo Apple Pay" },
              { n: "4", title: "Parkujte", desc: "Dostanete instrukce na email" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center", position: "relative" }}>
                {i < 3 && <div style={{ position: "absolute", top: "20px", left: "calc(50% + 20px)", width: "calc(100% - 40px)", height: "1px", background: "linear-gradient(to right, #FED7AA, #FFF7ED)" }} />}
                <div style={{ width: "40px", height: "40px", background: "#F97316", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "600", margin: "0 auto 16px", position: "relative", zIndex: 1, boxShadow: "0 0 0 6px rgba(249,115,22,0.12)" }}>{s.n}</div>
                <h4 style={{ fontSize: "14px", fontWeight: "600", color: "#1C1917", marginBottom: "6px" }}>{s.title}</h4>
                <p style={{ fontSize: "13px", color: "#78716C", lineHeight: "1.6" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ padding: "72px 32px", background: "#fff" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ fontSize: "12px", color: "#F97316", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Recenze</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "34px", color: "#1C1917", marginBottom: "40px", letterSpacing: "-0.5px" }}>Co říkají naši uživatelé</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {[
              { stars: 5, text: "Konečně parkovací služba která funguje. Našla jsem místo 2 minuty od arény a zaplatila polovinu než v garáži.", name: "Eliška M.", city: "Praha", init: "EM" },
              { stars: 5, text: "Používám Parketix každý den do práce. Ušetřím skoro 800 Kč měsíčně oproti klasickému parkovišti.", name: "Jan Kovář", city: "Brno", init: "JK" },
              { stars: 5, text: "Super aplikace. Rezervace proběhla hladce a majitel byl velmi ochotný. Určitě znovu.", name: "Petra S.", city: "Liberec", init: "PS" },
            ].map((r, i) => (
              <div key={i} className="review-card">
                <div style={{ color: "#F97316", fontSize: "16px", marginBottom: "12px" }}>{"★".repeat(r.stars)}</div>
                <p style={{ fontSize: "14px", color: "#57534E", lineHeight: "1.7", marginBottom: "16px", fontStyle: "italic" }}>"{r.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#FFF7ED", border: "1px solid #FED7AA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "600", color: "#F97316" }}>{r.init}</div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#1C1917" }}>{r.name}</div>
                    <div style={{ fontSize: "12px", color: "#9CA3AF" }}>{r.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OWNER CTA */}
      <section style={{ padding: "72px 32px", background: "linear-gradient(135deg, #1C1917 0%, #292524 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(249,115,22,0.08)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{ fontSize: "12px", color: "#FB923C", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>Pro majitele míst</div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "36px", color: "#fff", marginBottom: "14px", letterSpacing: "-0.5px" }}>Máte volné parkovací místo?</h2>
          <p style={{ fontSize: "16px", color: "#A8A29E", lineHeight: "1.7", marginBottom: "32px" }}>Průměrný majitel vydělá přes 3 000 Kč měsíčně. Registrace je zdarma a trvá 5 minut.</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button className="btn-primary" style={{ fontSize: "16px", padding: "14px 28px" }}>Přidat místo zdarma →</button>
            <button className="btn-secondary" style={{ color: "#E7E5E4", borderColor: "#57534E", fontSize: "16px", padding: "14px 28px" }}>Zjistit více</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0C0A09", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "18px", color: "#57534E" }}>parketix</span>
        <span style={{ fontSize: "13px", color: "#44403C" }}>© 2025 Parketix s.r.o. · Podmínky použití · Ochrana soukromí</span>
        <div style={{ display: "flex", gap: "20px" }}>
          {["O nás", "Kontakt", "Blog"].map(l => (
            <a key={l} href="#" style={{ fontSize: "13px", color: "#57534E", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      </footer>

    </main>
  );
}