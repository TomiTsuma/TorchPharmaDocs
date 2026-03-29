import type { Metadata } from "next"
import Link from "next/link"
import { ApiTable } from "@/components/api-entry"

export const metadata: Metadata = {
  title: "torch_pharma.models | Torch Pharma",
  description: "API index for all torch_pharma neural network model classes",
}

export default function ModelsPage() {
  return (
    <main className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-3xl font-bold">torch_pharma.models</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Neural network models for molecular generation, property prediction, and geometric deep learning.
      </p>

      {/* ── Diffusion ── */}
      <h2 className="api-category">
        <Link href="/models/diffusion" className="hover:underline">Diffusion</Link>
      </h2>
      <ApiTable rows={[
        { name: "EquivariantVariationalDiffusion", href: "/models/diffusion#evd",    description: "SE(3)-equivariant continuous-time diffusion model for joint 3D coordinate and atom-type generation." },
        { name: "PredefinedNoiseSchedule",         href: "/models/diffusion#pns",    description: "Fixed analytic noise schedule (cosine or polynomial), maps t → γ(t)." },
        { name: "GammaNetwork",                    href: "/models/diffusion#gamma",  description: "Learnable monotone noise schedule as a positive-weight MLP. Requires loss_type='vlb'." },
        { name: "PositiveLinear",                  href: "/models/diffusion#poslin", description: "Linear layer with softplus-constrained positive weights. Building block of GammaNetwork." },
      ]} />

      {/* ── Dynamics: EGNN ── */}
      <h2 className="api-category">
        <Link href="/models/dynamics" className="hover:underline">Dynamics — EGNN</Link>
      </h2>
      <ApiTable rows={[
        { name: "EGNNDynamics",        href: "/models/dynamics#egnn-dynamics", description: "EVD-compatible denoising backbone. Wraps EGNN_Sparse_Network with time/context conditioning and CoG-centred output projection." },
        { name: "EGNN_Sparse_Network", href: "/models/dynamics#egnn-network",  description: "Stack of EGNN_Sparse layers with optional token embeddings and global linear attention." },
        { name: "EGNN_Sparse",         href: "/models/dynamics#egnn-sparse",   description: "Single sparse EGNN message-passing layer with optional Fourier encoding, soft edge attention, and CoorsNorm." },
        { name: "CoorsNorm",           href: "/models/dynamics#coorsnorm",     description: "Learnable scalar normalization for 3D direction vectors. Prevents coordinate drift." },
      ]} />

      {/* ── Dynamics: GCPNet ── */}
      <h2 className="api-category">
        <Link href="/models/dynamics" className="hover:underline">Dynamics — GCPNet</Link>
      </h2>
      <ApiTable rows={[
        { name: "GCPInteractions", href: "/models/dynamics#gcp-interactions", description: "Full GCPNet interaction block: message-passing + feedforward + norm + dropout." },
        { name: "GCPMessagePassing", href: "/models/dynamics#gcp-mp",        description: "Geometry-complete message passing using chained GCP2 layers and scalar attention gating." },
        { name: "GCPEmbedding",    href: "/models/dynamics#gcp-embed",       description: "Input embedding: atom-type lookup + GCPLayerNorm + GCP projections for nodes and edges." },
        { name: "GCP2",            href: "/models/dynamics#gcp2",            description: "Improved GCP that fuses frame scalarization into the scalar MLP in a single pass." },
        { name: "GCP",             href: "/models/dynamics#gcp",             description: "Geometry-Complete Perceptron: scalar+vector inputs, local frame update in two sequential passes." },
      ]} />

      {/* ── Distributions / Sampling ── */}
      <h2 className="api-category">
        <Link href="/models/transformers" className="hover:underline">Distributions & Sampling</Link>
      </h2>
      <ApiTable rows={[
        { name: "NumNodesDistribution",   href: "/models/transformers#nnd",   description: "Histogram prior over molecule sizes p(N). Wraps torch.distributions.Categorical." },
        { name: "PropertiesDistribution", href: "/models/transformers#pd",    description: "Empirical property distribution conditioned on molecule size. Enables guided generation." },
        { name: "CategoricalDistribution",href: "/models/transformers#cd",    description: "Fixed histogram distribution over discrete categories with KL divergence evaluation." },
        { name: "Queue",                  href: "/models/transformers#queue", description: "Fixed-length FIFO for maintaining a rolling window of scalar metric values." },
      ]} />

      {/* ── Shared Primitives ── */}
      <h2 className="api-category">Shared Primitives</h2>
      <ApiTable rows={[
        { name: "GCPLayerNorm",  href: "#", description: "Layer normalization for ScalarVector inputs. Applies separate norms to scalar and vector channels." },
        { name: "GCPDropout",    href: "#", description: "Dropout that consistently zeros both scalar and vector channels of a ScalarVector." },
      ]} />
    </main>
  )
}
