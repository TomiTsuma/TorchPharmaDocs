import type { Metadata } from "next"
import { ApiEntry, ApiTable } from "@/components/api-entry"

export const metadata: Metadata = {
  title: "torch_pharma.features | Torch Pharma",
  description: "API reference for geometric utilities, ScalarVector, and equivariant frame operations",
}

export default function FeaturesPage() {
  return (
    <main className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold">torch_pharma.features</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Geometric data structures and SE(3)-equivariant frame operations.
      </p>

      <pre className="api-code-block mb-8">
        <code>{`from torch_pharma.features import (
    ScalarVector,
    centralize, decentralize,
    localize,
    scalarize, vectorize,
    safe_norm,
    get_nonlinearity,
    is_identity,
)`}</code>
      </pre>

      <h2 className="api-category">Classes</h2>
      <ApiTable rows={[
        { name: "ScalarVector", href: "#scalarvector", description: "Named tuple holding a scalar Tensor [N, s] and a vector Tensor [N, v, 3]. Supports arithmetic, indexing, masking, flatten, and recover." },
      ]} />

      <h2 className="api-category">Functions</h2>
      <ApiTable rows={[
        { name: "centralize(batch, key, batch_index, node_mask, edm)",    href: "#centralize",    description: "Subtract the per-graph centre of gravity from a coordinate attribute." },
        { name: "decentralize(batch, key, batch_index, centroid, ...)",   href: "#decentralize",  description: "Add back the stored centroid to restore original-frame coordinates." },
        { name: "localize(pos, edge_index, norm_x_diff)",                 href: "#localize",      description: "Build a per-edge orthonormal local frame f_ij ∈ ℝ^{E×3×3} from atom positions." },
        { name: "scalarize(vectors, edge_index, frames, ...)",            href: "#scalarize",     description: "Project vector features into rotation-invariant scalars using local frames." },
        { name: "vectorize(scalars, edge_index, frames, ...)",            href: "#vectorize",     description: "Lift scalar gate values back into equivariant 3D vectors using local frames." },
        { name: "safe_norm(x, dim, eps, keepdim, sqrt)",                  href: "#safenorm",      description: "Numerically stable L2 norm: √(Σx² + ε) + ε." },
        { name: "get_nonlinearity(name, return_functional, slope)",       href: "#getnl",         description: "Instantiate an activation function by name string. Returns nn.Module or functional." },
        { name: "is_identity(nonlinearity)",                               href: "#isidentity",    description: "Return True if the nonlinearity is None or nn.Identity." },
      ]} />

      {/* ── ScalarVector ── */}
      <div id="scalarvector" className="mt-10">
        <ApiEntry
          name="torch_pharma.features.ScalarVector"
          kind="class"
          signature="scalar: Tensor, vector: Tensor"
          description="A named tuple subclass for holding paired scalar and vector representations. The scalar channel has shape [N, s] and the vector channel has shape [N, v, 3]. Arithmetic operators (+, *) are overloaded to apply to both channels simultaneously."
          params={[
            { name: "scalar", type: "Tensor", description: "Scalar features, shape (N, s)." },
            { name: "vector", type: "Tensor", description: "Vector features, shape (N, v, 3)." },
          ]}
          example={`from torch_pharma.features import ScalarVector

sv = ScalarVector(scalar=torch.zeros(10, 64), vector=torch.zeros(10, 4, 3))

# Arithmetic
sv2 = sv + sv                         # elementwise add on both channels
sv3 = sv * 2.0                        # scalar multiply on both channels

# Indexing
sub = sv.idx(torch.tensor([0, 1, 2])) # selects rows 0,1,2 from both channels

# Flatten / recover
flat = sv.flatten()                   # → Tensor (10, 64 + 4*3)
sv4  = ScalarVector.recover(flat, vector_dim=4)  # → ScalarVector

# Masking
mask = torch.ones(10, dtype=torch.bool)
mask[5:] = False
sv_masked = sv.mask(mask)             # zeros rows 5-9 in both channels`}
          methods={[
            { name: "concat", signature: "others, dim=-1", description: "torch.cat scalar channels and torch.cat vector channels of self and others along dim.", returns: "Tuple[Tensor, Tensor]" },
            { name: "flatten", signature: "", description: "Reshape vector to (N, 3v) then cat with scalar → (N, s + 3v).", returns: "Tensor" },
            { name: "ScalarVector.recover", signature: "x, vector_dim", description: "Class method. Inverse of flatten: split a flat tensor back into (scalar, vector) ScalarVector.", returns: "ScalarVector" },
            { name: "idx", signature: "index", description: "Index both scalar and vector channels with the same index tensor.", returns: "ScalarVector" },
            { name: "mask", signature: "node_mask", description: "Zero-out rows where node_mask is False in both channels.", returns: "ScalarVector" },
            { name: "vs", signature: "", description: "Unpack to a plain (scalar, vector) tuple.", returns: "Tuple[Tensor, Tensor]" },
            { name: "clone", signature: "", description: "Deep copy both channels.", returns: "ScalarVector" },
          ]}
        />
      </div>

      {/* ── centralize ── */}
      <div id="centralize" className="mt-10">
        <ApiEntry
          name="torch_pharma.features.centralize"
          kind="function"
          signature="batch, key, batch_index, node_mask=None, edm=False"
          description="Subtract the centre of gravity (CoG) of each graph from the attribute batch.key. Returns both the per-graph centroid and the centered attribute. Required for translation-invariant diffusion."
          params={[
            { name: "batch", type: "torch_geometric.data.Batch", description: "Molecular batch; must have attribute key." },
            { name: "key", type: "str", description: "Attribute name to centralize (e.g. 'x' for positions)." },
            { name: "batch_index", type: "Tensor", description: "Graph membership index, shape (N,)." },
            { name: "node_mask", type: "Tensor, optional", description: "Boolean mask; if provided, masked nodes are excluded from the CoG calculation.", default: "None" },
            { name: "edm", type: "bool", description: "If True, use the EDM-style mask-weighted mean and assert masked values are negligibly small.", default: "False" },
          ]}
          returns="Tuple[Tensor, Tensor] — (centroid shape (B, 3), centered_coords shape (N, 3))"
        />
      </div>

      {/* ── localize ── */}
      <div id="localize" className="mt-10">
        <ApiEntry
          name="torch_pharma.features.localize"
          kind="function"
          signature="pos, edge_index, norm_x_diff=True"
          description="Construct a per-edge orthonormal local SE(3) frame f_ij. Each frame is a (3, 3) matrix whose columns are the direction vector, cross-product vector, and vertical vector derived from the positions of the two endpoint atoms."
          params={[
            { name: "pos", type: "Tensor", description: "Node positions, shape (N, 3)." },
            { name: "edge_index", type: "Tensor", description: "Edge index, shape (2, E)." },
            { name: "norm_x_diff", type: "bool", description: "Normalize difference and cross vectors to unit length (with +1 denominator to avoid division by zero).", default: "True" },
          ]}
          returns="Tensor — local frames f_ij, shape (E, 3, 3)"
          example={`from torch_pharma.features import localize

f_ij = localize(batch.x, batch.edge_index)   # (E, 3, 3)
# columns: [x_diff, x_cross, x_vertical]`}
        />
      </div>

      {/* ── scalarize ── */}
      <div id="scalarize" className="mt-10">
        <ApiEntry
          name="torch_pharma.features.scalarize"
          kind="function"
          signature="vectors, edge_index, frames, node_inputs=False, dim_size=None, node_mask=None"
          description="Project equivariant vector features into rotation-invariant scalar features using local SE(3) frames. Computes frames @ vectors for each edge and concatenates the 3×3 inner products into a 9-dim scalar per entity."
          params={[
            { name: "vectors", type: "Tensor", description: "Vector features to scalarize, shape (E, 3, k) for edges or (N, 3, k) for nodes." },
            { name: "edge_index", type: "Tensor", description: "Edge index, shape (2, E)." },
            { name: "frames", type: "Tensor", description: "Local frames returned by localize(), shape (E, 3, 3)." },
            { name: "node_inputs", type: "bool", description: "If True, scatter-aggregate edge scalarizations onto nodes.", default: "False" },
            { name: "dim_size", type: "int, optional", description: "Number of nodes N, required when node_inputs=True.", default: "None" },
            { name: "node_mask", type: "Tensor, optional", description: "Boolean node mask.", default: "None" },
          ]}
          returns="Tensor — rotation-invariant scalars, shape (E or N, 9)"
        />
      </div>

      {/* ── vectorize ── */}
      <div id="vectorize" className="mt-10">
        <ApiEntry
          name="torch_pharma.features.vectorize"
          kind="function"
          signature="scalars, edge_index, frames, node_inputs=False, dim_size=None, node_mask=None"
          description="Lift scalar gate values back into equivariant 3D vectors using local SE(3) frames. Interprets each group of 3 scalars as coefficients for the 3 frame axes, reconstructing direction-aware 3D vectors."
          params={[
            { name: "scalars", type: "Tensor", description: "Gate scalar features, shape (E or N, 3k) where k = number of frame triplets." },
            { name: "edge_index", type: "Tensor", description: "Edge index, shape (2, E)." },
            { name: "frames", type: "Tensor", description: "Local frames, shape (E, 3, 3)." },
            { name: "node_inputs", type: "bool", description: "If True, scatter-aggregate results back to nodes.", default: "False" },
          ]}
          returns="Tensor — equivariant vectors, shape (E or N, 3, k)"
        />
      </div>

      {/* ── safe_norm ── */}
      <div id="safenorm" className="mt-10">
        <ApiEntry
          name="torch_pharma.features.safe_norm"
          kind="function"
          signature="x, dim=-1, eps=1e-8, keepdim=False, sqrt=True"
          description="Numerically stable L2 norm. Computes √(sum(x², dim) + eps) + eps when sqrt=True, or sum(x², dim) + eps when sqrt=False. The double eps prevents NaN gradients at zero vectors."
          params={[
            { name: "x", type: "Tensor", description: "Input tensor." },
            { name: "dim", type: "int", description: "Dimension along which to compute the norm.", default: "-1" },
            { name: "eps", type: "float", description: "Small constant for numerical stability.", default: "1e-8" },
            { name: "keepdim", type: "bool", description: "Whether to retain the reduced dimension.", default: "False" },
            { name: "sqrt", type: "bool", description: "If True return L2 norm; if False return squared L2 + eps.", default: "True" },
          ]}
          returns="Tensor — same shape as x except along dim"
        />
      </div>

      {/* ── get_nonlinearity ── */}
      <div id="getnl" className="mt-10">
        <ApiEntry
          name="torch_pharma.features.get_nonlinearity"
          kind="function"
          signature="name, return_functional=False, slope=0.01"
          description="Instantiate a nonlinearity by name string. Returns either an nn.Module instance or the corresponding functional for use inside forward()."
          params={[
            { name: "name", type: "str or None", description: "One of: null/None → Identity, relu, leakyrelu, selu, silu/swish, sigmoid, tanh." },
            { name: "return_functional", type: "bool", description: "If True, return F.relu / F.silu etc. instead of an nn.Module.", default: "False" },
            { name: "slope", type: "float", description: "Negative slope for leakyrelu.", default: "0.01" },
          ]}
          returns="nn.Module or callable"
          example={`from torch_pharma.features import get_nonlinearity

act = get_nonlinearity("silu")                          # nn.SiLU()
fn  = get_nonlinearity("relu", return_functional=True)  # F.relu
identity = get_nonlinearity(None)                       # nn.Identity()`}
        />
      </div>
    </main>
  )
}
