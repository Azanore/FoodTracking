// Test component for Button variants
import { Button } from './ui';

export function ButtonTest() {
  return (
    <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ marginBottom: '12px', fontSize: '18px', fontWeight: 600 }}>Primary Variant</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="primary">Save</Button>
          <Button variant="primary" disabled>Save (Disabled)</Button>
        </div>
      </div>

      <div>
        <h2 style={{ marginBottom: '12px', fontSize: '18px', fontWeight: 600 }}>Secondary Variant</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="secondary">Cancel</Button>
          <Button variant="secondary" disabled>Cancel (Disabled)</Button>
        </div>
      </div>

      <div>
        <h2 style={{ marginBottom: '12px', fontSize: '18px', fontWeight: 600 }}>Danger Variant</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="danger">Delete</Button>
          <Button variant="danger" disabled>Delete (Disabled)</Button>
        </div>
      </div>

      <div>
        <h2 style={{ marginBottom: '12px', fontSize: '18px', fontWeight: 600 }}>Ghost Variant (New)</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="ghost">Skip</Button>
          <Button variant="ghost" disabled>Skip (Disabled)</Button>
        </div>
      </div>

      <div>
        <h2 style={{ marginBottom: '12px', fontSize: '18px', fontWeight: 600 }}>All Together</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="primary" onClick={() => console.log('Primary clicked')}>Save</Button>
          <Button variant="secondary" onClick={() => console.log('Secondary clicked')}>Cancel</Button>
          <Button variant="danger" onClick={() => console.log('Danger clicked')}>Delete</Button>
          <Button variant="ghost" onClick={() => console.log('Ghost clicked')}>Skip</Button>
        </div>
      </div>
    </div>
  );
}
