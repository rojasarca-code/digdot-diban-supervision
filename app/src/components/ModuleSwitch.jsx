export default function ModuleSwitch({ modulo, setModulo }) {
  const btn = (id, label) => {
    const active = modulo === id;
    return (
      <button
        key={id}
        onClick={() => setModulo(id)}
        aria-pressed={active}
        style={{
          flex: 1, padding: '7px 6px', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'Manrope,sans-serif',
          border: '1px solid #000', borderRadius: 8, background: active ? '#000' : '#fff', color: active ? '#fff' : '#000'
        }}
      >{label}</button>
    );
  };
  return (
    <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
      {btn('supervision', 'Supervisión')}
      {btn('monitoreo', 'Monitoreo El Niño')}
    </div>
  );
}
