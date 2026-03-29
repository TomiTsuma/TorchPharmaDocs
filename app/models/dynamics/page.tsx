import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dynamics Networks | Torch Pharma",
  description: "EGNN and GCPNet denoising dynamics networks for equivariant diffusion",
}

export default function DynamicsPage() {
  return (
    <main className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-4xl font-bold">Dynamics Networks</h1>
      <p className="mb-8 text-muted-foreground">
        <code>torch_pharma.models.dynamics</code>
      </p>

      <p className="mb-6">
        Dynamics networks are the <em>denoising backbones</em> injected into{" "}
        <code>EquivariantVariationalDiffusion</code>. They take a noisy molecular graph at timestep t and
        predict the noise (ε-parametrization). Two implementations are provided:
      </p>
      <ul className="mb-8 list-inside list-disc space-y-1">
        <li>
          <code>EGNNDynamics</code> — EGNN-based, simpler and faster
        </li>
        <li>
          <code>GCPNetDynamics</code> — Geometry-Complete Perceptron, geometrically richer
        </li>
      </ul>

      {/* ─── EGNN Section ─── */}
      <h2 className="mb-4 mt-8 text-2xl font-semibold">EGNN Dynamics</h2>
      <p className="mb-4">
        Located in <code>torch_pharma.models.dynamics.egnn</code>. Three classes form a hierarchy from
        simple to full network:
      </p>

      <h3 className="mb-3 mt-6 text-lg font-semibold">
        <code>EGNN_Simple</code>
      </h3>
      <p className="mb-4">
        A single-layer EGNN for rapid prototyping. Encodes positions and features jointly, applies a
        single round of edge, coordinate, and node MLPs with residual connections, and returns the
        updated concatenated tensor.
      </p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4 text-sm">
        <code>{`layer = EGNN_Simple(feats_dim=64, pos_dim=3, m_dim=16, edge_attr_dim=0)
x_out = layer(x, edge_index, edge_attr, batch)   # x shape: (N, 3+feats_dim)`}</code>
      </pre>

      <h3 className="mb-3 mt-6 text-lg font-semibold">
        <code>EGNN_Sparse</code> (MessagePassing)
      </h3>
      <p className="mb-4">
        A sparse EGNN layer that inherits from PyG <code>MessagePassing</code>. Separates edge
        assignment (radius graph build, done externally) from message computation, which is efficient for
        locally connected or k-NN graphs. Key design decisions:
      </p>
      <div className="mb-6 overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left">Parameter</th>
              <th className="px-4 py-2 text-left">Default</th>
              <th className="px-4 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-2 font-mono">feats_dim</td>
              <td className="px-4 py-2">—</td>
              <td className="px-4 py-2">Node feature dimensionality</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">pos_dim</td>
              <td className="px-4 py-2">3</td>
              <td className="px-4 py-2">Spatial position dimensions</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">m_dim</td>
              <td className="px-4 py-2">16</td>
              <td className="px-4 py-2">Message hidden dimension</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">fourier_features</td>
              <td className="px-4 py-2">0</td>
              <td className="px-4 py-2">Number of Fourier distance encodings (0 = raw squared distance)</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">soft_edge</td>
              <td className="px-4 py-2">0</td>
              <td className="px-4 py-2">When &gt;0 adds a sigmoid-gated soft edge attention weight</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">norm_coors</td>
              <td className="px-4 py-2">True</td>
              <td className="px-4 py-2">Apply <code>CoorsNorm</code> to relative coordinates before aggregation</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">coors_tanh</td>
              <td className="px-4 py-2">True</td>
              <td className="px-4 py-2">Tanh on coordinate MLP output (requires norm_coors=True)</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">update_feats / update_coors</td>
              <td className="px-4 py-2">True / True</td>
              <td className="px-4 py-2">Toggle to update only features or only positions</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">coor_weights_clamp_value</td>
              <td className="px-4 py-2">None</td>
              <td className="px-4 py-2">Optional value to clamp coordinate update weights for stability</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">dropout</td>
              <td className="px-4 py-2">0.0</td>
              <td className="px-4 py-2">Dropout applied inside edge and node MLPs</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mb-6">
        All linear layers are initialized with Xavier normal and zero bias. A custom{" "}
        <code>propagate()</code> override implements the full coordinate + feature update outside of the
        standard PyG aggregation flow to maintain separate coors and feats update paths.
      </p>

      <h3 className="mb-3 mt-6 text-lg font-semibold">
        <code>EGNN_Sparse_Network</code>
      </h3>
      <p className="mb-4">
        Stacks N <code>EGNN_Sparse</code> layers. Supports optional node/edge token embedding tables,
        periodic edge recalculation, and global linear attention every k layers.
      </p>
      <div className="mb-6 overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left">Parameter</th>
              <th className="px-4 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-2 font-mono">n_layers</td>
              <td className="px-4 py-2">Number of stacked EGNN_Sparse layers</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">embedding_nums / embedding_dims</td>
              <td className="px-4 py-2">Token embedding tables for integer node features</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">edge_embedding_nums / edge_embedding_dims</td>
              <td className="px-4 py-2">Token embedding tables for integer edge features</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">recalc</td>
              <td className="px-4 py-2">Recalculate edge features every recalc layers (0 = disabled)</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">global_linear_attn_every</td>
              <td className="px-4 py-2">Insert global attention every k layers (0 = disabled)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 className="mb-3 mt-6 text-lg font-semibold">
        <code>EGNNDynamics</code>
      </h3>
      <p className="mb-4">
        The complete denoising module. Wraps <code>EGNN_Sparse_Network</code> with the EVD-specific
        input/output protocol: builds edge indices for the fully-connected masked graph, concatenates
        time and context features onto node embeddings, centralizes coordinates, runs EGNN, then projects
        to velocity + scalar predictions.
      </p>
      <h4 className="mb-2 mt-4 font-semibold">Key constructor parameters</h4>
      <div className="mb-6 overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left">Parameter</th>
              <th className="px-4 py-2 text-left">Default</th>
              <th className="px-4 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-2 font-mono">num_atom_types</td>
              <td className="px-4 py-2">16</td>
              <td className="px-4 py-2">Must match EVD config</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">h_hidden_dim</td>
              <td className="px-4 py-2">256</td>
              <td className="px-4 py-2">Node scalar hidden width</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">num_encoder_layers</td>
              <td className="px-4 py-2">9</td>
              <td className="px-4 py-2">Depth of EGNN_Sparse_Network</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">condition_on_time</td>
              <td className="px-4 py-2">True</td>
              <td className="px-4 py-2">Appends t as an extra scalar feature per node</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">conditioning</td>
              <td className="px-4 py-2">[]</td>
              <td className="px-4 py-2">List of context property keys for guided generation</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">self_condition</td>
              <td className="px-4 py-2">True</td>
              <td className="px-4 py-2">Doubles input dims to accept xh_self_cond</td>
            </tr>
          </tbody>
        </table>
      </div>
      <h4 className="mb-2 mt-4 font-semibold">Forward pass pipeline</h4>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4 text-sm">
        <code>{`1. Build fully-connected edge_index (filtered by node_mask)
2. Extract node features via _node_features (chi = vector-valued geom. features)
3. Extract edge features via _edge_features (e = scalar, xi = vector-valued)
4. Self-condition: concatenate xh_self_cond features if available
5. Time-condition: append t per node
6. Context-condition: append property context per node
7. Centralize coordinates (CoG=0 projection)
8. Linear-embed h → node_embedding(h), e → edge_embedding(e)
9. Run EGNN_Sparse_Network
10. Compute velocity vel = x_out - x_in, project to CoG=0
11. Return batch, cat([vel, h_final])`}</code>
      </pre>

      {/* ─── GCPNet Section ─── */}
      <h2 className="mb-4 mt-10 text-2xl font-semibold">GCPNet Dynamics</h2>
      <p className="mb-4">
        Located in <code>torch_pharma.models.dynamics.gcpnet</code>. The Geometry-Complete Perceptron
        (GCP) framework uses <strong>complete local frames</strong> derived from edge geometry to make
        message passing both rotationally equivariant and <em>geometry-complete</em> (every geometric
        degree of freedom is captured).
      </p>

      <h3 className="mb-3 mt-6 text-lg font-semibold">Core GCP Layers</h3>
      <div className="mb-6 space-y-4">
        <div className="rounded-md border p-4">
          <p className="mb-1 font-mono font-semibold">GCP</p>
          <p className="text-sm text-muted-foreground">
            The foundational building block. Takes <code>ScalarVector</code> input, projects vectors to
            scalars via norm, runs a scalar MLP, gates vectors with scalar outputs, and optionally integrates
            local frame information for full geometry completeness.
          </p>
        </div>
        <div className="rounded-md border p-4">
          <p className="mb-1 font-mono font-semibold">GCP2</p>
          <p className="text-sm text-muted-foreground">
            An improved version that fuses local frame scalarization directly into the scalar MLP input,
            producing direction-robust geometric features in a single forward pass rather than sequential
            update steps.
          </p>
        </div>
        <div className="rounded-md border p-4">
          <p className="mb-1 font-mono font-semibold">GCPEmbedding</p>
          <p className="text-sm text-muted-foreground">
            Input embedding layer. Applies optional atom-type embedding, pre/post-normalization with
            <code>GCPLayerNorm</code>, and runs separate GCP projections for node and edge representations
            before the main message-passing blocks.
          </p>
        </div>
        <div className="rounded-md border p-4">
          <p className="mb-1 font-mono font-semibold">GCPMessagePassing</p>
          <p className="text-sm text-muted-foreground">
            Constructs messages by concatenating sender, receiver, and edge ScalarVectors, processing
            through a chain of GCP2 layers (with optional residual connections via ResGCP), optionally
            applying learned scalar message attention, then aggregating (sum/mean/max).
          </p>
        </div>
        <div className="rounded-md border p-4">
          <p className="mb-1 font-mono font-semibold">GCPInteractions</p>
          <p className="text-sm text-muted-foreground">
            Full interaction block = message-passing + feed-forward network. Supports pre/post-norm,
            dropout, position updates via aggregated vector outputs, and configurable FF depth.
          </p>
        </div>
      </div>

      <h3 className="mb-3 mt-6 text-lg font-semibold">Local Frame Construction</h3>
      <p className="mb-4">
        Frames are constructed per-edge from atom coordinates using{" "}
        <code>features.geometry.localize()</code>:
      </p>
      <pre className="mb-6 overflow-x-auto rounded-md bg-muted p-4 text-sm">
        <code>{`f_ij = [x_diff, x_cross, x_vertical]  # shape (E, 3, 3)
# x_diff  = normalized (x_i - x_j)
# x_cross = normalized (x_i × x_j)
# x_vertical = x_diff × x_cross`}</code>
      </pre>
      <p className="mb-6">
        These frames rotate equivariantly with the molecule, enabling the network to express direction-aware
        geometric features without breaking SE(3) symmetry.
      </p>

      <h3 className="mb-3 mt-6 text-lg font-semibold">GCPNet Gating Modes</h3>
      <div className="mb-6 overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left">Flag</th>
              <th className="px-4 py-2 text-left">Behaviour</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-2 font-mono">vector_gate=True</td>
              <td className="px-4 py-2">Gate vector output with sigmoid of scalar projection</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">frame_gate=True</td>
              <td className="px-4 py-2">Gate with frame-derived vectors (full geometric gating)</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">sigma_frame_gate=True</td>
              <td className="px-4 py-2">Row-wise sigma gating using frame vectors</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">ablate_frame_updates=True</td>
              <td className="px-4 py-2">Disable all frame-based updates (GCP-Baseline mode)</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">vector_residual=True</td>
              <td className="px-4 py-2">Residual connection on vector features before gate</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mb-4 mt-10 text-2xl font-semibold">
        <code>CoorsNorm</code>
      </h2>
      <p className="mb-6">
        A lightweight normalization module for 3D direction vectors. Normalizes each vector to unit
        length and applies a single learnable scalar scale initialized to <code>scale_init</code> (default
        1e-2). Used inside EGNN_Sparse to stabilize coordinate updates.
      </p>

      <h2 className="mb-4 mt-10 text-2xl font-semibold">Helper Utilities</h2>
      <div className="mb-6 overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left">Function</th>
              <th className="px-4 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="px-4 py-2 font-mono">exists(val)</td>
              <td className="px-4 py-2">Returns True if val is not None</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">fourier_encode_dist(dist, num_encodings)</td>
              <td className="px-4 py-2">Fourier basis encoding of pairwise squared distances</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">embedd_token(x, dims, layers)</td>
              <td className="px-4 py-2">Replace integer token dimensions with learned embeddings in-place</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono">NODE_FEATURE_DIFFUSION_TARGETS</td>
              <td className="px-4 py-2">Constant: set of diffusion target strings that include node features</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  )
}
