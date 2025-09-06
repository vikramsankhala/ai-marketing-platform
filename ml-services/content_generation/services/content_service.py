import logging
from typing import Dict, List, Any, Optional
from datetime import datetime

from models.gpt_generator import GPTGenerator
from models.text_optimizer import TextOptimizer
from models.seo_analyzer import SEOAnalyzer

logger = logging.getLogger(__name__)

class ContentService:
    """Main content generation service"""
    
    def __init__(self):
        self.gpt_generator = GPTGenerator()
        self.text_optimizer = TextOptimizer()
        self.seo_analyzer = SEOAnalyzer()
    
    def generate_content(
        self,
        prompt: str,
        content_type: str,
        tone: str,
        length: str,
        keywords: List[str] = None,
        target_audience: str = "general",
        language: str = "en",
        optimize: bool = True,
        analyze_seo: bool = True
    ) -> Dict[str, Any]:
        """Generate content with optional optimization and SEO analysis"""
        
        try:
            # Generate base content
            result = self.gpt_generator.generate_content(
                prompt=prompt,
                content_type=content_type,
                tone=tone,
                length=length,
                keywords=keywords or [],
                target_audience=target_audience,
                language=language
            )
            
            content = result['content']
            
            # Optimize content if requested
            if optimize:
                optimization_result = self.text_optimizer.optimize(
                    content=content,
                    optimization_type='general',
                    target_metrics={
                        'readability_score': 70,
                        'engagement_score': 80,
                        'clarity_score': 75
                    }
                )
                
                if optimization_result.get('optimized_content'):
                    content = optimization_result['optimized_content']
                    result['optimization'] = optimization_result
            
            # Analyze SEO if requested
            if analyze_seo:
                seo_result = self.seo_analyzer.analyze(
                    content=content,
                    target_keywords=keywords or []
                )
                result['seo_analysis'] = seo_result
            
            # Update content with optimized version
            result['content'] = content
            
            # Add generation metadata
            result['generation_metadata'] = {
                'generated_at': datetime.utcnow().isoformat(),
                'service_version': '1.0.0',
                'optimization_applied': optimize,
                'seo_analysis_applied': analyze_seo
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Error in content generation service: {str(e)}")
            raise
    
    def generate_content_batch(
        self,
        requests: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Generate multiple pieces of content in batch"""
        
        results = []
        
        for i, request in enumerate(requests):
            try:
                result = self.generate_content(**request)
                results.append({
                    'success': True,
                    'data': result,
                    'request_index': i
                })
            except Exception as e:
                logger.error(f"Error generating content for request {i}: {str(e)}")
                results.append({
                    'success': False,
                    'error': str(e),
                    'request_index': i
                })
        
        return results
    
    def generate_content_variations(
        self,
        content: str,
        num_variations: int = 3,
        variation_type: str = "tone"
    ) -> List[Dict[str, Any]]:
        """Generate variations of existing content"""
        
        try:
            variations = self.gpt_generator.generate_variations(
                content=content,
                num_variations=num_variations,
                variation_type=variation_type
            )
            
            return variations
            
        except Exception as e:
            logger.error(f"Error generating content variations: {str(e)}")
            raise
    
    def analyze_content_quality(
        self,
        content: str,
        content_type: str = "general"
    ) -> Dict[str, Any]:
        """Analyze content quality metrics"""
        
        try:
            # Get readability analysis
            readability = self.text_optimizer.analyze_readability(content)
            
            # Get SEO analysis
            seo_analysis = self.seo_analyzer.analyze(content)
            
            # Calculate overall quality score
            quality_score = self._calculate_quality_score(
                readability, seo_analysis, content_type
            )
            
            return {
                'quality_score': quality_score,
                'readability': readability,
                'seo_analysis': seo_analysis,
                'recommendations': self._generate_recommendations(
                    readability, seo_analysis, quality_score
                )
            }
            
        except Exception as e:
            logger.error(f"Error analyzing content quality: {str(e)}")
            raise
    
    def _calculate_quality_score(
        self,
        readability: Dict[str, Any],
        seo_analysis: Dict[str, Any],
        content_type: str
    ) -> float:
        """Calculate overall content quality score"""
        
        # Base scores
        readability_score = readability.get('score', 0)
        seo_score = seo_analysis.get('overall_score', 0)
        
        # Weight factors based on content type
        weights = {
            'blog': {'readability': 0.4, 'seo': 0.6},
            'social': {'readability': 0.7, 'seo': 0.3},
            'email': {'readability': 0.6, 'seo': 0.4},
            'ad': {'readability': 0.5, 'seo': 0.5},
            'landing': {'readability': 0.3, 'seo': 0.7}
        }
        
        weight = weights.get(content_type, {'readability': 0.5, 'seo': 0.5})
        
        quality_score = (
            readability_score * weight['readability'] +
            seo_score * weight['seo']
        )
        
        return round(quality_score, 2)
    
    def _generate_recommendations(
        self,
        readability: Dict[str, Any],
        seo_analysis: Dict[str, Any],
        quality_score: float
    ) -> List[str]:
        """Generate content improvement recommendations"""
        
        recommendations = []
        
        # Readability recommendations
        if readability.get('score', 0) < 60:
            recommendations.append("Improve readability by using shorter sentences and simpler words")
        
        if readability.get('avg_sentence_length', 0) > 20:
            recommendations.append("Reduce average sentence length for better readability")
        
        # SEO recommendations
        if seo_analysis.get('keyword_density', 0) < 1:
            recommendations.append("Increase keyword density for better SEO")
        
        if seo_analysis.get('meta_description_score', 0) < 70:
            recommendations.append("Improve meta description for better search visibility")
        
        if seo_analysis.get('heading_structure_score', 0) < 70:
            recommendations.append("Improve heading structure with proper H1, H2, H3 hierarchy")
        
        # General recommendations
        if quality_score < 70:
            recommendations.append("Overall content quality needs improvement")
        
        return recommendations
