import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase/server';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { slug } = await params;

  const { data: guest } = await supabase
    .from('guests')
    .select('name')
    .eq('slug', slug)
    .single();

  const firstName = guest?.name?.split(' ')[0] ?? 'You';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f0e0d',
          position: 'relative',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 70% 60% at 50% 55%, rgba(201,169,110,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Top line */}
        <div
          style={{
            position: 'absolute',
            top: 56,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: 13,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#C9A96E',
            }}
          >
            a personal invitation
          </span>
        </div>

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <span
            style={{
              fontSize: 110,
              fontWeight: 700,
              color: '#f0ebe0',
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            {firstName}
          </span>
          <span
            style={{
              fontSize: 28,
              color: '#8a8278',
              letterSpacing: '0.08em',
            }}
          >
            is invited
          </span>
        </div>

        {/* Bottom — host + date */}
        <div
          style={{
            position: 'absolute',
            bottom: 52,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 40,
              height: 1,
              background: '#C9A96E',
              marginBottom: 4,
            }}
          />
          <span style={{ fontSize: 18, color: '#C9A96E', letterSpacing: '0.06em' }}>
            Mary Clovers
          </span>
          <span style={{ fontSize: 14, color: '#8a8278', letterSpacing: '0.1em' }}>
            18 JUNE 2026
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
