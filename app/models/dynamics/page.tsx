import type { Metadata } from "next"
import { ApiEntry, ApiTable } from "@/components/api-entry"

export const metadata: Metadata = {
  title: "torch_pharma.models.dynamics | Torch Pharma",
  description: "API reference for EGNN and GCPNet denoising dynamics networks",
}

export default function DynamicsPage() {
  return (
    <main className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold">torch_pharma.models.dynamics</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Equivariant denoising backbones for molecular diffusion models.
      </p>

      <h2 className="api-category">Classes — EGNN</h2>
      <ApiTable rows={[
        { name: "EGNN_Sparse",         href: "#egnn-sparse",   description: "Single sparse EGNN message-passing layer with optional coordinate normalization and soft edge attention." },
        { name: "EGNN_Sparse_Network", href: "#egnn-network",  description: "Stack of EGNN_Sparse layers with optional token embeddings, edge recalculation, and global linear attention." },
        { name: "EGNNDynamics",        href: "#egnn-dynamics", description: "Full EVD-compatible denoising module wrapping EGNN_Sparse_Network with time and context conditioning." },
        { name: "CoorsNorm",           href: "#coorsnorm",     description: "Learnable scalar normalization for 3D direction vectors used inside EGNN_Sparse." },
      ]} />

      <h2 className="api-category">Classes — GCPNet</h2>
      <ApiTable rows={[
        { name: "GCP",                href: "#gcp",                "description": "Geometry-Complete Perceptron layer: scalar+vector inputs, local frame update in two sequential passes." },
        { name: "GCP2",               href: "#gcp2",               description: "Improved GCP that fuses frame scalarization into the scalar MLP in a single forward pass." },
        { name: "GCPEmbedding",       href: "#gcp-embed",          description: "Input embedding layer: atom-type lookup + pre/post-norm + separate GCP projections for nodes and edges." },
        { name: "GCPMessagePassing",  href: "#gcp-mp",             description: "Message-passing aggregation using chained GCP2 layers with optional residual connections and scalar attention." },
        { name: "GCPInteractions",    href: "#gcp-interactions",   description: "Full interaction block: message-passing + feed-forward network with pre/post-norm and optional position updates." },
      ]} />

      {/* ── EGNN_Sparse ── */}
      <div id="egnn-sparse" className="mt-10">
        <ApiEntry
          name="torch_pharma.models.dynamics.egnn.EGNN_Sparse"
          kind="class"
          signature="feats_dim, pos_dim=3, m_dim=16, fourier_features=0, soft_edge=0, norm_coors=True, coors_tanh=True, update_feats=True, update_coors=True, coor_weights_clamp_value=None, dropout=0.0, **kwargs"
          description="A single sparse EGNN message-passing layer (inherits from torch_geometric.nn.MessagePassing). For each edge (i,j) it computes a message m_ij from the squared distance and concatenated node features, then updates coordinates via a weighted sum of relative position vectors and updates node features via an aggregated MLP."
          params={[
            { name: "feats_dim", type: "int", description: "Dimensionality of input node features." },
            { name: "pos_dim", type: "int", description: "Spatial dimensionality (3 for molecules).", default: "3" },
            { name: "m_dim", type: "int", description: "Hidden dimension of the edge MLP.", default: "16" },
            { name: "fourier_features", type: "int", description: "Number of Fourier distance encodings appended to edge features. 0 = raw squared distance only.", default: "0" },
            { name: "soft_edge", type: "int", description: "When > 0, adds a sigmoid-gated attention weight on coordinate updates.", default: "0" },
            { name: "norm_coors", type: "bool", description: "Apply CoorsNorm to relative position vectors before aggregation.", default: "True" },
            { name: "coors_tanh", type: "bool", description: "Apply tanh to the coordinate MLP output. Requires norm_coors=True.", default: "True" },
            { name: "update_feats", type: "bool", description: "Whether to update node features in the forward pass.", default: "True" },
            { name: "update_coors", type: "bool", description: "Whether to update node coordinates in the forward pass.", default: "True" },
            { name: "coor_weights_clamp_value", type: "float, optional", description: "If set, clamps coordinate update weights to this absolute value for numerical stability.", default: "None" },
            { name: "dropout", type: "float", description: "Dropout probability inside edge and node MLPs.", default: "0.0" },
          ]}
          example={`from torch_pharma.models.dynamics.egnn import EGNN_Sparse

layer = EGNN_Sparse(feats_dim=64, pos_dim=3, m_dim=16)
# feats: (N, feats_dim), coors: (N, 3)
out_feats, out_coors = layer(feats, coors, edges, batch)  # edges: (2, E)`}
          methods={[
            {
              name: "forward",
              signature: "feats, coors, edges, batch, edge_attr=None",
              description: "Run one EGNN message-passing step.",
              params: [
                { name: "feats", type: "Tensor", description: "Node features, shape (N, feats_dim)." },
                { name: "coors", type: "Tensor", description: "Node coordinates, shape (N, 3)." },
                { name: "edges", type: "Tensor", description: "Edge index, shape (2, E)." },
                { name: "batch", type: "Tensor", description: "Graph membership index, shape (N,)." },
                { name: "edge_attr", type: "Tensor, optional", description: "Additional scalar edge features.", default: "None" },
              ],
              returns: "Tuple[Tensor, Tensor] — (updated_feats, updated_coors)",
            },
          ]}
        />
      </div>

      {/* ── EGNN_Sparse_Network ── */}
      <div id="egnn-network" className="mt-10">
        <ApiEntry
          name="torch_pharma.models.dynamics.egnn.EGNN_Sparse_Network"
          kind="class"
          signature="n_layers, feats_dim, pos_dim=3, m_dim=16, fourier_features=0, soft_edge=0, norm_coors=True, coors_tanh=True, dropout=0.0, embedding_nums=None, embedding_dims=None, edge_embedding_nums=None, edge_embedding_dims=None, recalc=0, global_linear_attn_every=0"
          description="Stacks n_layers EGNN_Sparse layers. Supports optional learnable token-embedding tables for integer-typed node and edge features, periodic edge-feature recalculation, and global linear attention every k layers."
          params={[
            { name: "n_layers", type: "int", description: "Number of EGNN_Sparse layers to stack." },
            { name: "feats_dim", type: "int", description: "Node feature dimensionality (after optional embedding projection)." },
            { name: "embedding_nums", type: "list[int], optional", description: "Vocabulary sizes for each integer node feature dimension to embed.", default: "None" },
            { name: "embedding_dims", type: "list[int], optional", description: "Output embedding sizes corresponding to embedding_nums.", default: "None" },
            { name: "edge_embedding_nums / edge_embedding_dims", type: "list[int], optional", description: "Same as above but for edge features.", default: "None" },
            { name: "recalc", type: "int", description: "Recalculate edge features every recalc layers. 0 = disabled.", default: "0" },
            { name: "global_linear_attn_every", type: "int", description: "Insert a global linear attention layer every k layers. 0 = disabled.", default: "0" },
          ]}
        />
      </div>

      {/* ── EGNNDynamics ── */}
      <div id="egnn-dynamics" className="mt-10">
        <ApiEntry
          name="torch_pharma.models.dynamics.egnn.EGNNDynamics"
          kind="class"
          signature="num_atom_types, h_hidden_dim=256, num_encoder_layers=9, condition_on_time=True, conditioning=(), self_condition=True, include_charges=False, **egnn_kwargs"
          description="Complete EVD-compatible denoising backbone. Wraps EGNN_Sparse_Network with the full EVD input/output protocol: builds fully-connected masked edges, concatenates time and property context onto node embeddings, centralizes coordinates, runs EGNN, then projects outputs to coordinate velocity and scalar predictions."
          params={[
            { name: "num_atom_types", type: "int", description: "Must match EquivariantVariationalDiffusion.num_atom_types.", default: "5" },
            { name: "h_hidden_dim", type: "int", description: "Width of node scalar hidden features inside EGNN.", default: "256" },
            { name: "num_encoder_layers", type: "int", description: "Depth of the underlying EGNN_Sparse_Network.", default: "9" },
            { name: "condition_on_time", type: "bool", description: "Appends the scalar timestep t as an extra feature per node.", default: "True" },
            { name: "conditioning", type: "list[str]", description: "List of property names (keys in the batch) to condition generation on.", default: "()" },
            { name: "self_condition", type: "bool", description: "If True, doubles input dims to accept the self-conditioning tensor xh_self_cond.", default: "True" },
            { name: "include_charges", type: "bool", description: "Append integer atomic charge features alongside atom types.", default: "False" },
          ]}
          example={`from torch_pharma.models.dynamics.egnn import EGNNDynamics

dynamics = EGNNDynamics(
    num_atom_types=5,
    h_hidden_dim=256,
    num_encoder_layers=9,
    conditioning=["alpha", "mu"],  # property-guided generation
)`}
          methods={[
            {
              name: "forward",
              signature: "batch, t, xh_self_cond=None",
              description: "Run one denoising step. Builds edges, embeds features, conditions on time and context, runs EGNN, returns predicted coordinate velocity and scalar noise.",
              params: [
                { name: "batch", type: "torch_geometric.data.Batch", description: "Noisy molecular batch containing x (coords) and h (atom types)." },
                { name: "t", type: "Tensor", description: "Timestep, shape (batch_size,), values in [0, 1]." },
                { name: "xh_self_cond", type: "Tensor, optional", description: "Previous denoised prediction for self-conditioning, same shape as batch.xh.", default: "None" },
              ],
              returns: "Tensor — predicted noise, shape (N, 3 + num_atom_types + optional_charges)",
            },
          ]}
        />
      </div>

      {/* ── CoorsNorm ── */}
      <div id="coorsnorm" className="mt-10">
        <ApiEntry
          name="torch_pharma.models.dynamics.egnn.CoorsNorm"
          kind="class"
          signature="eps=1e-8, scale_init=1e-2"
          description="Learnable scalar normalization for 3D direction vectors. Normalizes each vector to unit length then multiplies by a learned scalar scale parameter. Stabilizes coordinate updates inside EGNN_Sparse."
          params={[
            { name: "eps", type: "float", description: "Epsilon added to the norm to prevent division by zero.", default: "1e-8" },
            { name: "scale_init", type: "float", description: "Initial value of the learned scale parameter.", default: "1e-2" },
          ]}
        />
      </div>

      {/* ── GCP ── */}
      <div id="gcp" className="mt-10">
        <ApiEntry
          name="torch_pharma.models.dynamics.gcpnet.GCP"
          kind="class"
          signature="input_dims: ScalarVector, output_dims: ScalarVector, nonlinearities=('silu','silu'), scalar_out_nonlinearity='silu', scalar_gate=0, vector_gate=True, frame_gate=False, sigma_frame_gate=False, feedforward_out=False, bottleneck=1, vector_residual=False, vector_frame_residual=False, ablate_frame_updates=False, ablate_scalars=False, ablate_vectors=False, scalarization_vectorization_output_dim=3"
          description="Geometry-Complete Perceptron layer. Processes ScalarVector inputs by projecting vectors to scalars via norm, running a scalar MLP, gating vector outputs with scalar activations, and (unless ablated) integrating local SE(3) frame information to achieve geometry completeness."
          params={[
            { name: "input_dims", type: "ScalarVector", description: "A ScalarVector(s, v) giving the scalar and vector input channel counts." },
            { name: "output_dims", type: "ScalarVector", description: "A ScalarVector(s, v) giving the scalar and vector output channel counts." },
            { name: "nonlinearities", type: "Tuple[str, str]", description: "Activation functions for scalar and vector channels.", default: "('silu', 'silu')" },
            { name: "vector_gate", type: "bool", description: "Gate vector outputs with sigmoid of a scalar projection.", default: "True" },
            { name: "frame_gate", type: "bool", description: "Gate vectors using frame-derived directions (full geometric gating).", default: "False" },
            { name: "sigma_frame_gate", type: "bool", description: "Row-wise sigma gating using frame vectors.", default: "False" },
            { name: "bottleneck", type: "int", description: "Compression factor for the vector down-projection hidden dim.", default: "1" },
            { name: "ablate_frame_updates", type: "bool", description: "Disable all frame-based updates. Reduces to GCP-Baseline.", default: "False" },
          ]}
          methods={[
            {
              name: "forward",
              signature: "s_maybe_v, edge_index, frames, node_inputs=False, node_mask=None",
              description: "Forward pass. Accepts either a (scalar, vector) tuple or a flat scalar tensor.",
              returns: "ScalarVector or Tensor — updated (scalar, vector) or scalar only if vector_output_dim=0",
            },
          ]}
        />
      </div>

      {/* ── GCP2 ── */}
      <div id="gcp2" className="mt-10">
        <ApiEntry
          name="torch_pharma.models.dynamics.gcpnet.GCP2"
          kind="class"
          signature="input_dims: ScalarVector, output_dims: ScalarVector, ..."
          description="Improved GCP layer that fuses local frame scalarization directly into the scalar MLP input in a single forward pass. Produces direction-robust geometric features without the sequential update of GCP. Accepts the same constructor arguments as GCP."
          methods={[
            {
              name: "forward",
              signature: "s_maybe_v, edge_index, frames, node_inputs=False, node_mask=None",
              description: "Same signature as GCP.forward. Scalar and vector representations are jointly updated with frame information in one pass.",
              returns: "ScalarVector or Tensor",
            },
          ]}
        />
      </div>

      {/* ── GCPEmbedding ── */}
      <div id="gcp-embed" className="mt-10">
        <ApiEntry
          name="torch_pharma.models.dynamics.gcpnet.GCPEmbedding"
          kind="class"
          signature="edge_input_dims: ScalarVector, node_input_dims: ScalarVector, edge_hidden_dims: ScalarVector, node_hidden_dims: ScalarVector, num_atom_types: int, nonlinearities=('silu','silu'), pre_norm=True, use_gcp_norm=True, selected_GCP=GCP2, ..."
          description="Initial embedding layer for GCPNet. Optionally looks up atom-type embeddings, applies GCPLayerNorm (pre or post), and runs separate GCP projections for node and edge ScalarVector representations."
          params={[
            { name: "edge_input_dims", type: "ScalarVector", description: "Scalar and vector input dims for edges." },
            { name: "node_input_dims", type: "ScalarVector", description: "Scalar and vector input dims for nodes." },
            { name: "edge_hidden_dims", type: "ScalarVector", description: "Target scalar and vector output dims for edges." },
            { name: "node_hidden_dims", type: "ScalarVector", description: "Target scalar and vector output dims for nodes." },
            { name: "num_atom_types", type: "int", description: "Number of atom types; if > 0 creates an nn.Embedding for atom-type lookup." },
            { name: "pre_norm", type: "bool", description: "If True normalise inputs before embedding; otherwise normalise outputs.", default: "True" },
            { name: "selected_GCP", type: "type", description: "GCP variant class to use (GCP or GCP2).", default: "GCP2" },
          ]}
          methods={[
            {
              name: "forward",
              signature: "batch: torch_geometric.data.Batch",
              description: "Reads h, chi, e, xi, edge_index, f_ij from the batch and returns embedded node and edge ScalarVectors.",
              returns: "Tuple[ScalarVector, ScalarVector] — (node_rep, edge_rep)",
            },
          ]}
        />
      </div>

      {/* ── GCPMessagePassing ── */}
      <div id="gcp-mp" className="mt-10">
        <ApiEntry
          name="torch_pharma.models.dynamics.gcpnet.GCPMessagePassing"
          kind="class"
          signature="input_dims: ScalarVector, output_dims: ScalarVector, edge_dims: ScalarVector, reduce_function='sum', use_scalar_message_attention=True, use_residual_message_gcp=True"
          description="Geometry-complete message passing. For each edge, constructs a message by concatenating sender, receiver, and edge ScalarVectors. Processes through a chain of GCP2 layers with optional residual connections (ResGCP). Applies learned scalar attention gating then aggregates messages by reduce_function."
          params={[
            { name: "input_dims", type: "ScalarVector", description: "Node scalar and vector input channel dims." },
            { name: "output_dims", type: "ScalarVector", description: "Node scalar and vector output channel dims." },
            { name: "edge_dims", type: "ScalarVector", description: "Edge scalar and vector channel dims." },
            { name: "reduce_function", type: "str", description: "Aggregation function: 'sum', 'mean', or 'max'.", default: "'sum'" },
            { name: "use_scalar_message_attention", type: "bool", description: "Learn a scalar gate applied to aggregated scalar messages.", default: "True" },
            { name: "use_residual_message_gcp", type: "bool", description: "Add residual connections inside the message GCP chain (ResGCP).", default: "True" },
          ]}
        />
      </div>

      {/* ── GCPInteractions ── */}
      <div id="gcp-interactions" className="mt-10">
        <ApiEntry
          name="torch_pharma.models.dynamics.gcpnet.GCPInteractions"
          kind="class"
          signature="node_dims: ScalarVector, edge_dims: ScalarVector, cfg: DictConfig, layer_cfg: DictConfig, dropout=0.0, nonlinearities=None, update_node_positions=False"
          description="Full GCPNet interaction block. Composes GCPMessagePassing with a configurable feedforward network, layer normalization (GCPLayerNorm), and dropout (GCPDropout). Optionally updates node positions using the aggregated vector-channel outputs."
          params={[
            { name: "node_dims", type: "ScalarVector", description: "Node scalar and vector hidden channel dims." },
            { name: "edge_dims", type: "ScalarVector", description: "Edge scalar and vector hidden channel dims." },
            { name: "dropout", type: "float", description: "Dropout probability applied after message passing and after feedforward.", default: "0.0" },
            { name: "update_node_positions", type: "bool", description: "If True, compute a position update from aggregated vector features.", default: "False" },
          ]}
        />
      </div>
    </main>
  )
}
